const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: String,
  status: String,
  reminder: Boolean,
  shedulerId: String,
  interval: Number,
});

const TasksSchema = new mongoose.Schema({
  userId: Number,
  tasks: [TaskSchema],
});

const Tasks = mongoose.model("Tasks", TasksSchema);

module.exports = { Tasks };
