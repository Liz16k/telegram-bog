import { getTasks } from "node-cron";
import { Markup } from "telegraf";
import { Tasks } from "../models/Tasks.js";

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

const fetchUsersTasks = async () => {
  try {
    const tasks = await Tasks.find();
    return tasks;
  } catch (error) {
    console.error("Ошибка при получении задач из базы данных:", error);
    return [];
  }
};

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
    console.log("TASKSDOC",taskId, tasksDoc);
    const taskIndex = tasksDoc.tasks.findIndex(
      (task) => task._id.toString() === taskId
    );
    const task = tasksDoc.tasks.splice(taskIndex, 1);
    console.log("TASKINDEX",taskIndex, task);
    console.log(task.shedulerId);
    if (task.shedulerId) deleteTaskSheduler(task[0].shedulerId);
    await tasksDoc.save();
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error.message);
    throw error;
  }
}

async function deleteTaskSheduler(shedulerId) {
  const sheduler = getTasks().get(shedulerId);
  sheduler.stop();
}

async function fetchTasksListKeyboard(userId) {
  const tasks = await fetchUserTasks(userId);
  let keyboard = Markup.inlineKeyboard([
    ...tasks.map((task, i) => [
      Markup.button.callback(
        `${i + 1}. ${task.name} (${task.status}) ❌`,
        ["delete", task._id, userId].join("_")
      ),
    ]),
    [Markup.button.callback("Выйти", "exit")],
  ])
    .resize()
    .oneTime();
  return keyboard;
}

export {
  saveTaskToDB,
  deleteTaskFromDB,
  fetchUserTasks,
  fetchTasksListKeyboard,
  fetchUsersTasks,
};
