import express from "express";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import connect from "./utils/db";
import controllers from "./utils/auth";
const { signin, signup, checkToken, logout, protect } = controllers;
import todoControllers from "./resources/todo/todo.controllers";
const { createTodo } = todoControllers;
import todoRouter from "./resources/todo/todo.router";

const app = express();

app.use(
  cors({
    origin: "http://localhost:1234",
    credentials: true,
  })
);
app.use(json());
app.use(morgan("dev"));
app.use(cookieParser());

app.post("/signin", signin);
app.post("/signup", signup);
app.get("/token", checkToken);
app.post("/logout", logout);
app.use("/todos", protect, todoRouter);

const start = async () => {
  await connect();
  app.listen(3000, () => {
    console.log("Server on port 3000");
  });
};

export default start;
