const { Scenes } = require("telegraf");
const { Tasks } = require("../../models/Tasks");

const myTasksScene = new Scenes.BaseScene("myTasks");

myTasksScene.enter(async (ctx) => {
  const userId = ctx.message.from.id;
  const userDoc = await Tasks.findOne({ userId });
  const tasks = await userDoc.tasks;

  if (tasks.length) {
    await ctx.reply("Список задач:");
    tasks.forEach(async (task, index) => {
      await ctx.reply(`${index + 1}. ${task.text} (${task.status})`);
    });
  } else {
    ctx.reply("У вас пока нет задач.");
  }
  ctx.scene.leave();
});

module.exports = { myTasksScene };
