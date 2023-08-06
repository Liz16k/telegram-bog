import { Scenes, Markup } from "telegraf";
import { fetchSubsListKeyboard } from "#services/subscriptionService.js";
import { getWeather } from "#services/weatherService.js";
import { iconMap, msgs, logMsgs } from "#config/constants.js";
import { Subscription } from "#models/Subscription.js";

const mySubsScene = new Scenes.BaseScene("mySubs");
mySubsScene.enter(async (ctx) => {
  const userId = ctx.from.id;
  const bdUserSub = await Subscription.findOne({ userId });

  if (!bdUserSub || bdUserSub.subscriptions.length === 0) {
    await ctx.reply(msgs.NOTFOUND.SUBS);
    await ctx.scene.leave();
    return;
  }
  const backBtn = { text: "Выйти", data: "exit" };
  const subsListKeyboard = await fetchSubsListKeyboard(userId, backBtn, "👀");
  return ctx.reply(msgs.CAPTIONS.SUBS, subsListKeyboard);
});

mySubsScene.on("callback_query", async (ctx) => {
  try {
    const callbackData = JSON.parse(ctx.callbackQuery.data);

    if (callbackData.type === "exit") {
      return await ctx.scene.leave();
    }

    const city = callbackData.params;
    const [lat, lon] = callbackData.params.split("&");
    const params = lat & lon ? { lat, lon } : { city };

    await ctx.reply(msgs.WAIT.WEATHER);
    const currentWeather = await getWeather(params);
    const {
      weather: [{ description, icon }],
      main: { temp },
      name,
      wind: { speed },
    } = currentWeather;

    ctx.reply(
      `Погода сейчас (${name}):
    ${iconMap[icon]} ${Math.round(temp)}°C,
    ${description}
    Ветер: ${speed} м/с`,
      Markup.removeKeyboard()
    );
  } catch (error) {
    console.log(logMsgs.ERROR.SCENE, error.message);
  }
});

export { mySubsScene };
