import { Scenes, Markup } from "telegraf";

const subMenuScene = new Scenes.BaseScene("subscriptionMenu");
subMenuScene.enter(async (ctx) => {
  const message = await ctx.replyWithHTML(
    `
📃 <b>Мои подписки</b> --> список городов, на погоду в которых вы подписаны
👀 <b>Оформить подписку</b> --> подписаться на ежедневное уведомление о погоде 
❌ <b>Отменить подписку</b> --> отменить подписку на погоду 
`,
    Markup.inlineKeyboard([
      [Markup.button.callback("📃 Мои подписки", "MY_SUBSCRIPTIONS")],
      [
        Markup.button.callback("👀 Оформить подписку", "SUBSCRIBE"),
        Markup.button.callback("❌ Отменить подписку", "UNSUBSCRIBE"),
      ],
    ])
      .resize()
      .oneTime()
  );
  ctx.session.menuMsg = { message_id: message.message_id };
  return message;
});

subMenuScene.action("MY_SUBSCRIPTIONS", async (ctx) => {
  const messageId = await ctx.session?.menuMsg?.message_id;
  await ctx.deleteMessage(messageId);
  return ctx.scene.enter("mySubs");
});

subMenuScene.action("SUBSCRIBE", async (ctx) => {
  const messageId = await ctx.session?.menuMsg?.message_id;
  await ctx.deleteMessage(messageId);
  return ctx.scene.enter("subscribe");
});
subMenuScene.action("UNSUBSCRIBE", async (ctx) => {
  const messageId = await ctx.session?.menuMsg?.message_id;
  await ctx.deleteMessage(messageId);
  return ctx.scene.enter("unsubscribe");
});

export { subMenuScene };
