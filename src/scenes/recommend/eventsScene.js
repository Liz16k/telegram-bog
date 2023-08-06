import { Scenes, Markup } from "telegraf";
import { eventsSearch } from "#services/recommendService.js";
import { msgs, logMsgs } from "#config/constants.js";

const eventScene = new Scenes.BaseScene("events");
eventScene.enter(async (ctx) => {
  ctx.reply(
    msgs.LOCATION,
    Markup.keyboard([Markup.button.locationRequest("Отправить местоположение")])
      .resize()
      .oneTime()
  );
});

eventScene.on("message", async (ctx) => {
  try {
    let params;
    if (ctx.message.location) {
      const { latitude: lat, longitude: lon } = ctx.message.location;
      params = { lat, lon };
    } else {
      params = { city: ctx.message.text };
    }

    const { results } = await eventsSearch(params);

    if (results.length) {
      await ctx.reply(msgs.CAPTIONS.EVENTS, Markup.removeKeyboard());

      for (const result of results) {
        const {
          location: { formatted_address },
          name,
        } = result;
        await ctx.replyWithHTML(` 🎊 <b>${name}</b>\n${formatted_address}`);
      }
    } else {
      ctx.reply(msgs.NOTFOUND.EVENTS, Markup.removeKeyboard());
    }

    return await ctx.scene.leave();
  } catch (error) {
    ctx.reply(msgs.ERROR.RECOMMENDATION);
    console.error(logMsgs.SCENE, error.message);
  }
});

export { eventScene };
