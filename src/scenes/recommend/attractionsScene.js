import { Scenes, Markup } from "telegraf";
import { attractionsSearch } from "../../services/recommendService.js";

const attractionsScene = new Scenes.BaseScene("attractions");
attractionsScene.enter(async (ctx) => {
  try {
    ctx.reply(
      "Поделитесь своим местоположением",
      Markup.keyboard([
        Markup.button.locationRequest("Отправить местоположение"),
      ])
        .resize()
        .oneTime()
    );
  } catch (error) {
    console.log(error.message);
  }
});

attractionsScene.on("message", async (ctx) => {
  try {
    if (ctx.message.location) {
      const { latitude: lat, longitude: lon } = ctx.message.location;
      const data = await attractionsSearch({ lat, lon });

      await ctx.reply("Данные загружаются...");
      await ctx.reply("Ближайшие достопримечательности:");

      for (const [i, place] of data.entries()) {
        const { name, formatted, distance } = await place.properties;
        await ctx.replyWithHTML(
          ` 🗿 <b>${formatted ?? name}</b>\n${distance}м`
        );
      }

      return await ctx.scene.leave();
    } else {
      ctx.reply("Отправьте свое местоположение");
    }
  } catch (error) {
    console.log(error.message);
  }
});

export { attractionsScene };
