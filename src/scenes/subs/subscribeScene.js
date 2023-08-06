import axios from "axios";
import { Scenes, Markup } from "telegraf";
import { Subscription } from "#models/Subscription.js";
import { getCityNameByCoordinates } from "#services/weatherService.js";
import envVariables from "#config/index.js";
import { msgs, logMsgs } from "#config/constants.js";
const { OPEN_WEATHER_KEY } = envVariables;

const subscribeScene = new Scenes.BaseScene("subscribe");

subscribeScene.enter(async (ctx) => {
  return await ctx.reply(
    msgs.LOCATION,
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
      ctx.reply(msgs.NOTFOUND.CITY);
      return await ctx.scene.leave();
    } else {
      if (!bdUserSub) {
        const newSub = new Subscription({
          userId,
          subscriptions: [{ location: params }],
        });
        await newSub.save();
      } else if (!isSubscribed(params, bdUserSub.subscriptions)) {
        bdUserSub.subscriptions = [
          ...bdUserSub.subscriptions,
          { location: params },
        ];
        bdUserSub.save();
      } else {
        return ctx.reply(msgs.SIGNED);
      }
      Markup.removeKeyboard();
      ctx.reply(msgs.SUCCESS.WEATHER);
      return await ctx.scene.leave();
    }
  } catch (error) {
    console.log(logMsgs.ERROR.SCENE, error.message);
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
      {
        params: options,
      }
    );
    return response.data.length;
  } catch (error) {
    console.log(logMsgs.ERROR.FETCH, error.message);
  }
}

export { subscribeScene };
