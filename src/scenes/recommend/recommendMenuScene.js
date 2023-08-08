import { Scenes, Markup } from "telegraf";
const recommendMenuScene = new Scenes.BaseScene("recommendationsMenu");

recommendMenuScene.enter(async (ctx) => {
  const replyMsg = await ctx.reply(
    msgs.CAPTIONS.RECOMMENDATION,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(msgs.KEYBOARD.CAFE, "CAFE"),
        Markup.button.callback(msgs.KEYBOARD.EVENTS, "EVENTS"),
      ],
      [Markup.button.callback(msgs.KEYBOARD.ATTRACTIONS, "ATTRACTIONS")],
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
