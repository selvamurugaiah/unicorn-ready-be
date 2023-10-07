import express from "express";
import { Users } from "../models/user.model.js";
import {
  createUser,
  loginUser,
  authUser,
  logoutUser,
  changePassword,
  forgetPassword,
  tokenVerification,
} from "../controllers/user.controller.js";
import { authorizePasswordChange } from "../middlewares/auth.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    return res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findById(id);
    return res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/signup", createUser);

router.post("/login", loginUser);

router.post("/auth", authUser);

router.post("/logout", logoutUser);

router.post("/forget-password", forgetPassword);

router.post("/verify-token", tokenVerification);

router.post("/change-password/:id", authorizePasswordChange, changePassword);

export default router;
