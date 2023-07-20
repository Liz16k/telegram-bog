const { Scenes } = require("telegraf");
const { fetchUnsubListKeyboard } = require("../services/subscriptionService");
const { Subscription } = require("../database");

const unsubscribeScene = new Scenes.BaseScene("unsubscribe");

unsubscribeScene.enter(async (ctx) => {
  const userId = ctx.from.id;
  const keyboard = await fetchUnsubListKeyboard(userId);
  const replyMsg = await ctx.reply("Ваши подписки:", keyboard);
  const messageId = replyMsg.message_id;
  const chatId = ctx.chat.id;
  ctx.session.unsubMsg = {
    messageId,
    chatId,
  };
});

unsubscribeScene.action(/.*/, async (ctx) => {
  console.log("unsubscribe..." + JSON.stringify(ctx.callbackQuery));
  try {
    const subData = ctx.callbackQuery;
    await Subscription.findOneAndDelete({ ...subData });
    ctx.reply("Подписка успешно удалена");
    const keyboard = await fetchUnsubListKeyboard(subData.userId);

    const chatId = ctx.session.unsubMsg.chatId;
    const messageId = ctx.session.unsubMsg.messageId;

    await ctx.telegram.editMessageReplyMarkup(
      chatId,
      messageId,
      undefined,
      keyboard
    );
  } catch (error) {
    console.log(error.message);
  } finally {
    unsubscribeScene.leave();
  }
});

module.exports = { unsubscribeScene };
