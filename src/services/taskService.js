import { getTasks } from "node-cron";
import { Markup } from "telegraf";
import { Tasks } from "#models/Tasks.js";
import { logMsgs } from "#config/constants";

async function fetchUserTasks(userId) {
  try {
    let tasksDoc = await Tasks.findOne({ userId });
    if (!tasksDoc) return [];
    return tasksDoc.tasks;
  } catch (error) {
    console.error(logMsgs.ERROR.DB.FETCH, error.message);
    return [];
  }
}

const fetchUsersTasks = async () => {
  try {
    const tasks = await Tasks.find();
    return tasks;
  } catch (error) {
    console.error(logMsgs.ERROR.DB.FETCH, error);
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
    console.log(logMsgs.ERROR.DB.FETCH, error.message);
  }
}

async function deleteTaskFromDB(userId, taskId) {
  try {
    const tasksDoc = await Tasks.findOne({ userId });
    const taskIndex = tasksDoc.tasks.findIndex(
      (task) => task._id.toString() === taskId
    );
    const task = tasksDoc.tasks.splice(taskIndex, 1);

    if (task.shedulerId) deleteTaskSheduler(task[0].shedulerId);
    await tasksDoc.save();
  } catch (error) {
    console.error(logMsgs.ERROR.FETCH, error.message);
  }
}

async function deleteTaskSheduler(shedulerId) {
  const sheduler = getTasks().get(shedulerId);
  sheduler.stop();
}

async function fetchTasksListKeyboard(userId) {
  try {
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
  } catch (error) {
    console.error(logMsgs.ERROR.FETCH, error.message);
  }
}

export {
  saveTaskToDB,
  deleteTaskFromDB,
  fetchUserTasks,
  fetchTasksListKeyboard,
  fetchUsersTasks,
};
