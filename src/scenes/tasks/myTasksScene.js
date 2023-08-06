import { Scenes } from "telegraf";
import {
  fetchTasksListKeyboard,
  deleteTaskFromDB,
} from "#services/taskService.js";

const myTasksScene = new Scenes.BaseScene("myTasks");

myTasksScene.enter(async (ctx) => {
  const userId = ctx.message.from.id;
  const chatId = ctx.chat.id;
  const replyMsg = await ctx.reply(
    "Ваши задачи: ",
    await fetchTasksListKeyboard(userId)
  );
  const messageId = replyMsg?.message_id;
  ctx.session.taskListMsg = {
    messageId,
    chatId,
  };
});

myTasksScene.on("callback_query", async (ctx) => {
  const [action, taskId, userId] = await ctx.callbackQuery.data.split("_");
  const chatId = await ctx.session?.taskListMsg?.chatId;
  const messageId = await ctx.session?.taskListMsg?.messageId;

  if (action === "delete") {
    await deleteTaskFromDB(userId, taskId);

    await ctx.telegram.editMessageText(
      chatId,
      messageId,
      undefined,
      "Список обновлен",
      await fetchTasksListKeyboard(userId)
    );

    await ctx.answerCbQuery("Задача удалена");
  } else if (action === "exit") {
    await ctx.telegram.editMessageText(
      chatId,
      messageId,
      undefined,
      "Список обновлен"
    );
    return await ctx.scene.leave();
  }
});

export { myTasksScene };
