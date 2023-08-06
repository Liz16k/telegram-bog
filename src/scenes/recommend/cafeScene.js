import { Scenes, Markup } from "telegraf";
import { cafeSearch } from "#services/recommendService.js";
import { msgs, logMsgs } from "#config/constants.js";

const cafeScene = new Scenes.BaseScene("cafe");
cafeScene.enter(async (ctx) => {
  ctx.reply(
    msgs.GEO,
    Markup.keyboard([Markup.button.locationRequest("Отправить местоположение")])
      .resize()
      .oneTime()
  );
});

cafeScene.on("message", async (ctx) => {
  try {
    if (ctx.message.location) {
      const { latitude: lat, longitude: lon } = ctx.message.location;
      const data = await cafeSearch({ lat, lon });

      ctx.reply(msgs.WAIT.MAIN, Markup.removeKeyboard());
      ctx.reply(msgs.CAPTIONS.CAFE);

      for (const place of data) {
        const { formatted, distance } = place.properties;
        await ctx.replyWithHTML(` 🥞 <b>${formatted}</b>\n${distance}м`);
      }

      return await ctx.scene.leave();
    } else {
      ctx.reply(msgs.GEO);
    }
  } catch (error) {
    ctx.reply(msgs.ERROR.RECOMMENDATION);
    console.error(logMsgs.ERROR.SCENE, error.message);
  }
});

export { cafeScene };
