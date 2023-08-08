import { Scenes, Markup } from "telegraf";
import {
  getWeather,
  getCityNameByCoordinates,
} from "#services/weatherService.js";
import { msgs, logMsgs } from "#config/constants.js";
import { weatherResponse } from "#utils/weatherResponse";

const weatherScene = new Scenes.BaseScene("weather");

weatherScene.enter((ctx) => {
  ctx.reply(
    msgs.LOCATION,
    Markup.keyboard([
      ["Минск", "Брест", "Витебск"],
      [Markup.button.locationRequest(msgs.KEYBOARD.GEO)],
    ])
      .resize()
      .oneTime()
  );
});

weatherScene.on("message", async (ctx) => {
  try {
    let params;
    if (ctx.message.location) {
      const { latitude: lat, longitude: lon } = ctx.message.location;
      params = { lat, lon };
      params.city = await getCityNameByCoordinates({ lat, lon });
    } else {
      params = { city: ctx.message.text };
    }
    const currentWeather = await getWeather(params);

    await ctx.reply(msgs.WAIT.WEATHER);
    await ctx.reply(weatherResponse(currentWeather), Markup.removeKeyboard());
  } catch (error) {
    ctx.reply(msgs.ERROR.WEATHER, Markup.removeKeyboard());
    console.error(logMsgs.ERROR.SCENE, error.message);
  }
  ctx.scene.leave();
});

export { weatherScene };
