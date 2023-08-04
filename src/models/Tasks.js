import { Schema, model } from "mongoose";

const TaskSchema = new Schema({
  name: String,
  status: String,
  reminder: Boolean,
  shedulerId: String,
  interval: Number,
});

const TasksSchema = new Schema({
  userId: Number,
  tasks: [TaskSchema],
});

const Tasks = model("Tasks", TasksSchema);

export { Tasks };
