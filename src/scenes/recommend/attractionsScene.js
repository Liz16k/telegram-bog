import { Scenes, Markup } from "telegraf";
import { attractionsSearch } from "#services/recommendService.js";
import { msgs, logMsgs } from "#config/constants.js";

const attractionsScene = new Scenes.BaseScene("attractions");

attractionsScene.enter(async (ctx) => {
  ctx.reply(
    "Поделитесь своим местоположением",
    Markup.keyboard([Markup.button.locationRequest("Отправить местоположение")])
      .resize()
      .oneTime()
  );
});

attractionsScene.on("message", async (ctx) => {
  try {
    if (ctx.message.location) {
      const { latitude: lat, longitude: lon } = ctx.message.location;
      const data = await attractionsSearch({ lat, lon });

      await ctx.reply(msgs.WAIT.MAIN);
      await ctx.reply(msgs.CAPTION.ATTRACTIONS);

      for (const [_, place] of Object.entries(data)) {
        const { name, formatted, distance } = await place.properties;
        await ctx.replyWithHTML(
          ` 🗿 <b>${formatted ?? name}</b>\n${distance}м`
        );
      }
      return await ctx.scene.leave();
    } else {
      ctx.reply(msgs.GEO);
    }
  } catch (error) {
    ctx.reply(msgs.ERROR.RECOMMENDATION);
    console.error(logMsgs.SCENE, error.message);
  }
});

export { attractionsScene };
