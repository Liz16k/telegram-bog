import { Scenes, Markup } from "telegraf";
import { cafeSearch } from "#services/recommendService.js";
import { msgs, logMsgs } from "#config/constants.js";
import { sendGeoKeyboard } from "#config/keyboards.js";

const cafeScene = new Scenes.BaseScene("cafe");
cafeScene.enter(async (ctx) => {
  ctx.reply(msgs.GEO, sendGeoKeyboard());
});

cafeScene.on("message", async (ctx) => {
  try {
    if (ctx.message.location) {
      const { latitude: lat, longitude: lon } = ctx.message.location;
      const data = await cafeSearch({ lat, lon });

      await ctx.reply(msgs.WAIT.MAIN, Markup.removeKeyboard());
      await ctx.reply(msgs.CAPTIONS.CAFE);

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
