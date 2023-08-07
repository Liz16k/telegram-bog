import { Scenes, Markup } from "telegraf";
const recommendMenuScene = new Scenes.BaseScene("recommendationsMenu");

recommendMenuScene.enter(async (ctx) => {
  const replyMsg = await ctx.reply(
    `Выберите, что вам порекомендовать:`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback("🥞 Кафе", "CAFE"),
        Markup.button.callback("🎊 События", "EVENTS"),
      ],
      [Markup.button.callback("🗿 Достопримечательности", "ATTRACTIONS")],
    ])
      .resize()
      .oneTime()
  );
  ctx.session.menuMsg = { message_id: replyMsg.message_id };
  return replyMsg;
});

recommendMenuScene.action("CAFE", async (ctx) => {
  const messageId = await ctx.session?.menuMsg?.message_id;
  await ctx.deleteMessage(messageId);
  return ctx.scene.enter("cafe");
});

recommendMenuScene.action("EVENTS", async (ctx) => {
  const messageId = await ctx.session?.menuMsg?.message_id;
  await ctx.deleteMessage(messageId);
  return ctx.scene.enter("events");
});
recommendMenuScene.action("ATTRACTIONS", async (ctx) => {
  const messageId = await ctx.session?.menuMsg?.message_id;
  await ctx.deleteMessage(messageId);
  return ctx.scene.enter("attractions");
});

export { recommendMenuScene };
