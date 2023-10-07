import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import tasksRoutes from "./routes/task.routes.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Call the function to connect to the database
connectToDatabase();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/users", userRoutes);
app.use("/payment", paymentRoutes);
app.use("/tasks", tasksRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
