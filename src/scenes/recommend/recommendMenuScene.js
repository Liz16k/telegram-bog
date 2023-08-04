import { Scenes, Markup } from "telegraf";
const recommendMenuScene = new Scenes.BaseScene("recommendationsMenu");

recommendMenuScene.enter(async (ctx) => {
  return await ctx.reply(
    `Выберите, что вам порекомендовать:`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback("🥞 Кафе", "CAFE"),
        Markup.button.callback("🎊 События", "EVENTS"),
      ],
      [Markup.button.callback("🗿 Достопримечательности", "ATTRACTIONS")],
    ])
      .resize()
      .oneTime()
  );
});

recommendMenuScene.action("CAFE", (ctx) => {
  return ctx.scene.enter("cafe");
});

recommendMenuScene.action("EVENTS", (ctx) => {
  return ctx.scene.enter("events");
});
recommendMenuScene.action("ATTRACTIONS", (ctx) => {
  return ctx.scene.enter("attractions");
});

export { recommendMenuScene };
