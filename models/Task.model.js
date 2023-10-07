import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: String,
    deadline:{
      type:Date,
      required:true
    },
    subTasks: [String],
    status: {
      type: String,
      default: "Todo",
    },
  },
  { timestamps: true }
);

export const Tasks = mongoose.model("taskManagerTask", taskSchema);
