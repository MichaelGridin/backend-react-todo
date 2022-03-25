import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const todoSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  urgent: {
    type: Boolean,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
