const { Scenes } = require("telegraf");
const { fetchUserTasks } = require("../../services/taskService");

const myTasksScene = new Scenes.BaseScene("myTasks");

myTasksScene.enter(async (ctx) => {
  const userId = ctx.message.from.id;
  const tasks = await fetchUserTasks(userId);
  if (tasks.length) {
    await ctx.reply("Список задач:");
    for (let [i, task] of Object.entries(tasks)) {
      await ctx.reply(`📌 ${i + 1}. ${task.name} (${task.status})`);
    }
  } else {
    ctx.reply("У вас пока нет задач.");
  }
  ctx.scene.leave();
});

module.exports = { myTasksScene };
