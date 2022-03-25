const express = require("express");
const router = express.Router();
import todoControllers from "./todo.controllers";
const { createTodo, getTodos, deleteTodo, updateTodo } = todoControllers;

router.post("/", createTodo);
router.get("/", getTodos);
router.delete("/:id", deleteTodo);
router.put("/:id", updateTodo);

export default router;
