import { Scenes } from "telegraf";
import { fetchSubsListKeyboard } from "../../services/subscriptionService.js";
import { Subscription } from "../../models/Subscription.js";

const unsubscribeScene = new Scenes.BaseScene("unsubscribe");
const backBtn = { text: "Выйти", data: "exit" };

unsubscribeScene.enter(async (ctx) => {
  const userId = ctx.from.id;
  const replyMsg = await ctx.reply(
    "Ваши подписки:",
    await fetchSubsListKeyboard(userId, backBtn, "❌")
  );
  const messageId = replyMsg?.message_id;
  const chatId = ctx.chat.id;

  ctx.session.unsubMsg = {
    messageId,
    chatId,
  };
});

unsubscribeScene.on("callback_query", async (ctx) => {
  const cbData = ctx.callbackQuery.data;
  const data = JSON.parse(cbData);

  if (data.type === "exit") {
    ctx.answerCbQuery("Вы вышли из меню удаления подписок");
    return await ctx.scene.leave();
  }

  const userId = data?.userId;
  const user = await Subscription.findOne({ userId });
  const subIndex = user?.subscriptions.findIndex(
    (sub) => sub.location.city === data.city
  );
  user.subscriptions = user?.subscriptions.filter((_, i) => i !== subIndex);
  await user.save();

  const chatId = await ctx.session?.unsubMsg?.chatId;
  const messageId = await ctx.session?.unsubMsg?.messageId;

  await ctx.telegram.editMessageText(
    chatId,
    messageId,
    undefined,
    "Список обновлен",
    await fetchSubsListKeyboard(userId, backBtn, "❌")
  );

  ctx.answerCbQuery("Подписка успешно удалена");
});

export { unsubscribeScene };
