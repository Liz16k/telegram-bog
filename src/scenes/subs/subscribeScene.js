import { Scenes, Markup } from "telegraf";
import { Subscription } from "#models/Subscription.js";
import { getCityNameByCoordinates } from "#services/weatherService.js";
import { msgs, logMsgs } from "#config/constants.js";
import { isValidCityName } from "#utils/isValidCityName.js";
import { sendGeoKeyboard } from "#config/keyboards.js";

const subscribeScene = new Scenes.BaseScene("subscribe");

subscribeScene.enter(
  async (ctx) => await ctx.reply(msgs.LOCATION, sendGeoKeyboard())
);

subscribeScene.on("message", async (ctx) => {
  try {

    const userId = ctx.message.from.id;
    const bdUserSub = await Subscription.findOne({ userId });
    let params;

    if (ctx.message.location) {
      const { latitude: lat, longitude: lon } = ctx.message.location;
      params = { lat, lon };
      params.city = await getCityNameByCoordinates({ lat, lon });
    } else if (await isValidCityName(ctx.message.text)) {
      params = { city: ctx.message.text };
    } else {
      ctx.reply(
        msgs.NOTFOUND.CITY + "\n" + msgs.ERROR.WEATHER_SUB,
        Markup.removeKeyboard()
      );
      return ctx.scene.leave();
    }
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
      return ctx.reply(msgs.SIGNED, Markup.removeKeyboard());
    }

    ctx.reply(msgs.SUCCESS.WEATHER, Markup.removeKeyboard());
    return await ctx.scene.leave();
  } catch (error) {
    ctx.reply(msgs.ERROR.WEATHER_SUB);
    console.error(logMsgs.ERROR.SCENE, error.message);
  }
});

async function handleMessage(ctx) {
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
    ctx.reply(msgs.SUCCESS.WEATHER, Markup.removeKeyboard());
    return await ctx.scene.leave();
  }
}

function isSubscribed(location, subscriptions) {
  return !!subscriptions.filter((sub) => sub.location.city === location.city)
    .length;
}

export { subscribeScene };
