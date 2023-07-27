const mongoose = require("mongoose");

const TaskScheme = {
  text: String,
  dueDate: Date,
  status: String,
};

const TasksSchema = {
  userId: Number,
  tasks: [TaskScheme],
};

const Tasks = mongoose.model("Tasks", TasksSchema);

module.exports = { Tasks };
