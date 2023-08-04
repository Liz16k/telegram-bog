const { Scenes, Markup } = require("telegraf");

const subMenuScene = new Scenes.BaseScene("subscriptionMenu");
subMenuScene.enter(async (ctx) => {
  return await ctx.replyWithHTML(
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
      [Markup.button.locationRequest("Отправить местоположение", "location")],
    ])
      .resize()
      .oneTime()
  );
});

subMenuScene.action("MY_SUBSCRIPTIONS", (ctx) => {
  return ctx.scene.enter("mySubs");
});

subMenuScene.action("SUBSCRIBE", (ctx) => {
  return ctx.scene.enter("subscribe");
});
subMenuScene.action("UNSUBSCRIBE", (ctx) => {
  return ctx.scene.enter("unsubscribe");
});

module.exports = {
  subMenuScene,
};
