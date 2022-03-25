import Todo from "./todo.model";

const createTodo = async (req, res) => {
  if (!req.body.description) {
    return res.status(401).send({ message: "Missing fields" });
  }
  console.log(req.user);
  const todo = {
    description: req.body.description,
    urgent: Boolean(req.body.urgent),
    createdBy: req.user._id,
  };
  try {
    const newTodo = await Todo.create(todo);
    return res.status(201).send({ newTodo });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ createdBy: req.user._id });
    return res.status(201).send({ todos });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({
      _id: req.params.id,
    });
    return res.status(201).send({ deletedTodo });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};

const updateTodo = async (req, res) => {
  if (!req.body.description) {
    return res.status(401).send({ message: "Missing fields" });
  }
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { description: req.body.description, urgent: Boolean(req.body.urgent) },
      { new: true }
    );
    return res.status(201).send({ updatedTodo });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};

const todoControllers = { createTodo, getTodos, deleteTodo, updateTodo };
export default todoControllers;
