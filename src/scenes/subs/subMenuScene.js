import { Scenes, Markup } from "telegraf";
import { msgs } from "#config/constants.js";
import { subMenuKeyboard } from "#config/keyboards.js";

const subMenuScene = new Scenes.BaseScene("subscriptionMenu");

subMenuScene.enter(async (ctx) => {
  const message = await ctx.reply(msgs.SUBSCRIPTION_MENU.CAPTION, subMenuKeyboard());
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
