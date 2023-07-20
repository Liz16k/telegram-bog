const { Scenes, Markup } = require("telegraf");
const { Subscription } = require("../database");

const subscribeScene = new Scenes.BaseScene("subscribe");

subscribeScene.enter((ctx) => {
  ctx.replyWithMarkdownV2(
    "Введите населенный пункт или отправьте свое местоположение",
    Markup.keyboard([Markup.button.locationRequest("Отправить местоположение")])
      .resize()
      .oneTime()
  );
});

subscribeScene.on("message", async (ctx) => {
  try {
    const userId = ctx.message.from.id;
    let params;
    if (ctx.message.location) {
      params = {
        lat: ctx.message.location.latitude,
        lon: ctx.message.location.longitude,
      };
    } else {
      params = { city: ctx.message.text };
    }
    const newSub = new Subscription({ userId, location: params });
    await newSub.save();
    ctx.reply("Вы успешно подписаны на обновление о погоде.");
  } catch (error) {
    console.log(error.message);
  } finally {
    Markup.removeKeyboard();
    ctx.scene.leave();
  }
});

module.exports = { subscribeScene };
