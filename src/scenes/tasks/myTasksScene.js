import { Scenes } from "telegraf";
import { logMsgs, msgs } from "#config/constants.js";
import {
  fetchTasksListKeyboard,
  deleteTaskFromDB,
} from "#services/taskService.js";

const myTasksScene = new Scenes.BaseScene("myTasks");

myTasksScene.enter(async (ctx) => {
  const userId = ctx.message.from.id;
  const chatId = ctx.chat.id;
  const replyMsg = await ctx.reply(
    msgs.CAPTIONS.TASKS,
    await fetchTasksListKeyboard(userId)
  );
  const messageId = replyMsg?.message_id;
  ctx.session.taskListMsg = {
    messageId,
    chatId,
  };
});

myTasksScene.on("callback_query", async (ctx) => {
  try {
    const [action, taskId, userId] = await ctx.callbackQuery.data.split("_");
    const chatId = await ctx.session?.taskListMsg?.chatId;
    const messageId = await ctx.session?.taskListMsg?.messageId;

    if (action === "delete") {
      await deleteTaskFromDB(userId, taskId);

      await ctx.telegram.editMessageText(
        chatId,
        messageId,
        undefined,
        msgs.SUCCESS.SUBS_UPDATE,
        await fetchTasksListKeyboard(userId)
      );

      await ctx.answerCbQuery(msgs.SUCCESS.TASK_DELETE);
    } else if (action === "exit") {
      await ctx.deleteMessage(messageId);
      return await ctx.scene.leave();
    }
  } catch (error) {
    ctx.reply(msgs.ERROR.TASK_DELETE);
    console.error(logMsgs.ERROR.SCENE, error.message);
  }
});

export { myTasksScene };
