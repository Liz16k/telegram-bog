import { Scenes, Markup } from "telegraf";
import { eventsSearch } from "../../services/recommendService.js";

const eventScene = new Scenes.BaseScene("events");
eventScene.enter(async (ctx) => {
  try {
    ctx.reply(
      "Введите населенный пункт, или поделитесь своим местоположением",
      Markup.keyboard([
        Markup.button.locationRequest("Отправить местоположение"),
      ])
        .resize()
        .oneTime()
    );
  } catch (error) {
    console.log(error);
  }
});

eventScene.on("message", async (ctx) => {
  try {
    Markup.removeKeyboard();
    let params;
    if (ctx.message.location) {
      const { latitude: lat, longitude: lon } = ctx.message.location;
      params = { lat, lon };
    } else {
      params = { city: ctx.message.text };
    }

    const { results } = await eventsSearch(params);

    if (results.length) {
      await ctx.reply("Ближайшие события:");

      for (const result of results) {
        const {
          location: { formatted_address },
          name,
        } = result;
        await ctx.replyWithHTML(` 🎊 <b>${name}</b>\n${formatted_address}`);
      }
    } else {
      ctx.reply("Событий не найдено.");
    }

    return await ctx.scene.leave();
  } catch (error) {
    console.log(error.message);
  }
});

export { eventScene };
