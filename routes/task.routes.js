import express from "express";
import {
  addNewTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/task.controller.js";
import { authorizeAdmin, authorizeUser } from "../middlewares/auth.js";
import { Tasks } from "../models/Task.model.js";

const router = express.Router();

router.get("/", getAllTasks);

router.get("/todo", async (req, res) => {
  try {
    const todoTask = await Tasks.find({ status: "Todo" });
    return res.status(200).send(todoTask);
  } catch (error) {
    return res.status(500).send({ message: "From todo" });
  }
});

router.get("/doing", async (req, res) => {
  try {
    const todoTask = await Tasks.find({ status: "Doing" });
    return res.status(200).send(todoTask);
  } catch (error) {
    return res.status(500).send({ message: "From doing" });
  }
});

router.get("/done", async (req, res) => {
  try {
    const todoTask = await Tasks.find({ status: "Done" });
    return res.status(200).send(todoTask);
  } catch (error) {
    return res.status(500).send({ message: "From done" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Tasks.findById(id);
    return res.status(200).send(task);
  } catch (error) {
    return res.status(500).send({ message: "From ID Internal Server Error" });
  }
});


router.post("/", authorizeUser, addNewTask);
router.patch("/:id", authorizeAdmin, updateTask);
router.delete("/:id", authorizeAdmin, deleteTask);

export default router;
