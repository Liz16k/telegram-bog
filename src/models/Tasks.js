const mongoose = require("mongoose");

const TaskScheme = {
  name: String,
  status: String,
  reminder: Boolean,
  shedulerId: String,
  interval: Number,
};

const TasksSchema = {
  userId: Number,
  tasks: [TaskScheme],
};

const Tasks = mongoose.model("Tasks", TasksSchema);

module.exports = { Tasks };
