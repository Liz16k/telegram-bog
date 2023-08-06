import { Scenes, Markup } from "telegraf";
import { fetchSubsListKeyboard } from "#services/subscriptionService.js";
import { getWeather } from "#services/weatherService.js";
import { iconMap } from "#config/constants.js";

const mySubsScene = new Scenes.BaseScene("mySubs");
mySubsScene.enter(async (ctx) => {
  try {
    const userId = ctx.from.id;
    const backBtn = { text: "Выйти", data: "exit" };
    const subsListKeyboard = await fetchSubsListKeyboard(userId, backBtn, "👀");
    const subsCount = subsListKeyboard.reply_markup.inline_keyboard.length;
    return subsCount - 1 > 0
      ? ctx.reply(`Ваши текущие подписки:`, subsListKeyboard)
      : ctx.reply("У вас нет подписок на погоду");
  } catch (error) {
    console.log(error);
  }
});

mySubsScene.on("callback_query", async (ctx) => {
  try {
    const callbackData = JSON.parse(ctx.callbackQuery.data);

    if (callbackData.type === "exit") {
      return await ctx.scene.leave();
    }

    ctx.reply("Подождите, загружаю данные о погоде...");
    const currentWeather = await getWeather({ city: callbackData.city });
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
    console.log(error.message);
  }
});

export { mySubsScene };
