import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import { validateTodo } from "../middleware/validateTodo.js";

const router = express.Router();

// Get all todos
router.get("/", getTodos);

// Create a new todo
router.post("/", validateTodo, createTodo);

// Update a todo
router.put("/:id", validateTodo, updateTodo);

// Delete a todo
router.delete("/:id", deleteTodo);

export default router;
