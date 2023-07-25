const { Scenes, Markup } = require("telegraf");
const { Subscription } = require("../models/Subscription");
const axios = require("axios");
const { getCityNameByCoordinates } = require("../services/weatherService");
const { OPEN_WEATHER_KEY } = require("../config");

const subscribeScene = new Scenes.BaseScene("subscribe");

subscribeScene.enter(async (ctx) => {
  return await ctx.reply(
    "Введите населенный пункт или отправьте свое местоположение",
    Markup.keyboard([Markup.button.locationRequest("Отправить местоположение")])
      .resize()
      .oneTime()
  );
});

subscribeScene.on("message", async (ctx) => {
  try {
    const userId = ctx.message.from.id;
    const bdUserSub = await Subscription.findOne({ userId });
    let params;
    if (ctx.message.location) {
      const { latitude: lat, longitude: lon } = ctx.message.location;
      params = { lat, lon };
      params.city = await getCityNameByCoordinates({ lat, lon });
    } else {
      params = { city: ctx.message.text };
    }

    if (!ctx.message.location && !(await isValidCityName(ctx.message.text))) {
      ctx.reply("Населенный пункт не найден.");
      return await ctx.scene.leave();
    } else {
      if (!bdUserSub) {
        const newSub = new Subscription({ userId, location: params });
        await newSub.save();
      } else if (!isSubscribed(params, bdUserSub.subscriptions)) {
        bdUserSub.subscriptions = [
          ...bdUserSub.subscriptions,
          { location: params },
        ];
        bdUserSub.save();
      } else {
        return ctx.reply(
          "Вы уже имеете подписку на введенный населенный пункт."
        );
      }
      Markup.removeKeyboard();
      ctx.reply("Вы успешно подписаны на обновление о погоде.");
      return await ctx.scene.leave();
    }
  } catch (error) {
    console.log(error.message);
  }
});

function isSubscribed(location, subscriptions) {
  return !!subscriptions.filter((sub) => sub.location.city === location.city)
    .length;
}

async function isValidCityName(name) {
  try {
    const options = {
      q: name,
      appid: OPEN_WEATHER_KEY,
      limit: 1,
    };
    const response = await axios.get(
      "http://api.openweathermap.org/geo/1.0/direct",
      { params: options }
    );
    return response.data.length;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { subscribeScene };
