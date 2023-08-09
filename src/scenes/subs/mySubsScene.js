import { Scenes, Markup } from "telegraf";
import { fetchSubsListKeyboard } from "#services/subscriptionService.js";
import { getWeather } from "#services/weatherService.js";
import { msgs, logMsgs, btns } from "#config/constants.js";
import { Subscription } from "#models/Subscription.js";
import { weatherResponse } from "#utils/weatherResponse.js";

const mySubsScene = new Scenes.BaseScene("mySubs");

mySubsScene.enter(async (ctx) => {
  const userId = ctx.from.id;
  const bdUserSub = await Subscription.findOne({ userId });

  if (!bdUserSub || bdUserSub.subscriptions.length === 0) {
    await ctx.reply(msgs.NOTFOUND.SUBS);
    await ctx.scene.leave();
    return;
  }
  const subsListKeyboard = await fetchSubsListKeyboard(
    userId,
    btns.exitBtn,
    "👀"
  );
  const replyMsg = await ctx.reply(msgs.CAPTIONS.SUBS, subsListKeyboard);
  ctx.session.replyMsg = { message_id: replyMsg.message_id };
});

mySubsScene.on("callback_query", async (ctx) => {
  try {
    const callbackData = JSON.parse(ctx.callbackQuery.data);

    if (callbackData.type === "exit") {
      ctx.answerCbQuery(msgs.EXIT.SUBS);
      await ctx.deleteMessage(await ctx.session.replyMsg.message_id);
      return await ctx.scene.leave();
    }

    const city = callbackData.params;
    const [lat, lon] = callbackData.params.split("&");
    const params = lat & lon ? { lat, lon } : { city };

    await ctx.reply(msgs.WAIT.WEATHER);
    const currentWeather = await getWeather(params);
    
    ctx.reply(weatherResponse(currentWeather), Markup.removeKeyboard());
  } catch (error) {
    ctx.reply(msgs.ERROR.WEATHER);
    ctx.answerCbQuery(msgs.ERROR.WEATHER_HINT);
    console.error(logMsgs.ERROR.SCENE, error.message);
  }
});

export { mySubsScene };
