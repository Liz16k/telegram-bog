const mongoose = require("mongoose");

const TaskScheme = {
  name: String,
  dueDate: Date,
  status: String,
  reminder: Boolean,
  interval: Number,
};

const TasksSchema = {
  userId: Number,
  tasks: [TaskScheme],
};

const Tasks = mongoose.model("Tasks", TasksSchema);

module.exports = { Tasks };
