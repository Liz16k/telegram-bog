import { Scenes } from "telegraf";
import { recommendMenuKeyboard } from "#config/keyboards.js";
import { msgs } from "#config/constants.js";

const recommendMenuScene = new Scenes.BaseScene("recommendationsMenu");

recommendMenuScene.enter(async (ctx) => {
  const replyMsg = await ctx.reply(
    msgs.CAPTIONS.RECOMMENDATION,
    recommendMenuKeyboard()
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
