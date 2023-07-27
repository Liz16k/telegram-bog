const { Tasks } = require("../models/Tasks");

async function fetchUserTasks(userId) {
  try {
    let tasksDoc = await Tasks.findOne({ userId });
    if (!tasksDoc) return [];
    return tasksDoc.tasks;
  } catch (error) {
    console.error("Ошибка при получении списка задач:", error.message);
    return [];
  }
}
async function saveTaskToDB(userId, taskData) {
  try {
    const tasksDoc = await Tasks.findOne({ userId });
    if (tasksDoc !== null) {
      tasksDoc.tasks = [...tasksDoc.tasks, { ...taskData }];
      await tasksDoc.save();
    } else {
      const newTasksDoc = new Tasks({
        userId,
        tasks: [taskData],
      });
      await newTasksDoc.save();
    }
  } catch (error) {
    console.log(error.message);
  }
}
async function deleteTaskFromDB(userId, taskId) {
  try {
    const tasksDoc = await Tasks.findOne({ userId });
    const taskIndex = tasksDoc.tasks.findIndex(
      (task) => task._id.toString() === taskId
    );

    tasksDoc.tasks.splice(taskIndex, 1);
    await tasksDoc.save();
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error.message);
    throw error;
  }
}

module.exports = {
  saveTaskToDB,
  deleteTaskFromDB,
  fetchUserTasks,
};
