const { Scenes } = require("telegraf");
const { Tasks } = require("../../models/Tasks");

const createTaskScene = new Scenes.BaseScene("createTask");

createTaskScene.enter((ctx) => {
  ctx.reply("Введите задачу:");
});

createTaskScene.on("message", async (ctx) => {
  const userId = ctx.message.from.id;
  const text = ctx.message.text;

  const userDoc = await Tasks.findOne({ userId });
  console.log("userDOC", !!userDoc);
  if (userDoc) {
    userDoc.tasks = [...userDoc.tasks, { text, status: "todo" }];
    userDoc.save();
  } else {
    const newUserDoc = new Tasks({
      userId,
      tasks: [{ text, status: "todo" }],
    });
    newUserDoc.save();
  }

  ctx.reply("Задача создана успешно!");
  ctx.scene.leave();
});

module.exports = { createTaskScene };
