import { Scenes, Markup } from "telegraf";
import { msgs } from "#config/constants.js";

const { MY_SUBS, SUBSCRIBE, UNSUBSCRIBE } = msgs.SUBSCRIPTION_MENU;

const subMenuScene = new Scenes.BaseScene("subscriptionMenu");
subMenuScene.enter(async (ctx) => {
  const message = await ctx.replyWithHTML(
    msgs.SUBSCRIPTION_MENU,
    Markup.inlineKeyboard([
      [Markup.button.callback(MY_SUBS, "MY_SUBSCRIPTIONS")],
      [
        Markup.button.callback(SUBSCRIBE, "SUBSCRIBE"),
        Markup.button.callback(UNSUBSCRIBE, "UNSUBSCRIBE"),
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
