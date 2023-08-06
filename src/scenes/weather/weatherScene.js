import { Scenes, Markup } from "telegraf";
import {
  getWeather,
  getCityNameByCoordinates,
} from "#services/weatherService.js";
import { iconMap } from "#config/constants.js";

const weatherScene = new Scenes.BaseScene("weather");

weatherScene.enter((ctx) => {
  ctx.reply(
    "Введите населенный пункт, либо поделитесь своим местоположением.",
    Markup.keyboard([
      ["Минск", "Брест", "Витебск"],
      [Markup.button.locationRequest("Отправить местоположение")],
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
    const {
      weather: [{ description, icon }],
      main: { temp },
      name,
      wind: { speed },
    } = currentWeather;

    ctx.reply("Подождите, загружаю данные о погоде...");
    ctx.reply(
      `Погода сейчас (${name}):
      ${iconMap[icon]} ${Math.round(temp)}°C,
      ${description}
      Ветер: ${speed} м/с`,
      Markup.removeKeyboard()
    );
  } catch (error) {
    ctx.reply(
      "Данные о погоде не удалось получить, попробуйте еще раз.",
      Markup.removeKeyboard()
    );
  }

  ctx.scene.leave();
});

export { weatherScene };
