import { Tasks } from "../models/Task.model.js";

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find();
    return res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send({ message: "from All" });
  }
};

const addNewTask = async (req, res) => {
  console.log(req.body);
  try {
    const task = new Tasks(req.body);
    await task.save();
    return res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
};
const updateTask = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  try {
    const task = await Tasks.findByIdAndUpdate(id, req.body);
    await task.save();
    return res.status(200).send({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Unable to update, Please try again" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Tasks.findByIdAndDelete(id);
    return res.status(200).send({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Unable to delete,Please try again" });
  }
};

export { getAllTasks, addNewTask, updateTask, deleteTask };
