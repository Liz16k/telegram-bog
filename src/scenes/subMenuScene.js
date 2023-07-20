const { Scenes, Markup } = require("telegraf");
const { fetchSubscriptions } = require("../services/subscriptionService");

const subMenuScene = new Scenes.BaseScene("subscriptionMenu");

subMenuScene.enter((ctx) => {
  ctx.reply(
    "Вы попали в меню управления подпиской на уведомления о погоде",
    Markup.inlineKeyboard([
      [Markup.button.callback("Мои подписки", "MY_SUBSCRIPTIONS")],
      [
        Markup.button.callback("Оформить подписку", "SUBSCRIBE"),
        Markup.button.callback("Отменить подписку", "UNSUBSCRIBE"),
      ],
      [Markup.button.locationRequest("Отправить местоположение", "location")],
    ])
      .resize()
      .oneTime()
  );
});

subMenuScene.action("MY_SUBSCRIPTIONS", async (ctx) => {
  const userId = ctx.from.id;
  const subscriptions = await fetchSubscriptions(userId);

  if (subscriptions.length !== 0) {
    ctx.reply(
      subscriptions.reduce(
        (res, sub) => `${res}\n${sub.location}`,
        `Ваши текущие подписки:`
      )
    );
  } else {
    ctx.reply("У вас нет подписок на погоду");
  }
  ctx.scene.leave();
});

subMenuScene.action("SUBSCRIBE", (ctx) => {
  ctx.scene.enter("subscribe");
  ctx.scene.leave();
});
subMenuScene.action("UNSUBSCRIBE", (ctx) => {
  ctx.scene.enter("unsubscribe");
  ctx.scene.leave();
});

module.exports = {
  subMenuScene,
};
