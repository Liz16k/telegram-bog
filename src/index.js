const { Telegraf, Scenes, session } = require("telegraf");
const rateLimit = require("telegraf-ratelimit");
const { BOT_TOKEN } = require("./config");
const { GREETING, HELP } = require("./config/constants");
const { handleImageCommand } = require("./controllers/imageController");
const { handleWeatherCommand } = require("./controllers/weatherController");
const { weatherScene } = require("./scenes/weatherScene");

const bot = new Telegraf(BOT_TOKEN);
const stage = new Scenes.Stage([weatherScene]);
const limitConfig = {
  window: 1000,
  limit: 1,
  onLimitExceeded: (ctx) => ctx.reply("Rate limit exceeded"),
};

bot.use(rateLimit(limitConfig));
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => ctx.reply(GREETING));
bot.help((ctx) => ctx.reply(HELP));

bot.command("cat", handleImageCommand);
bot.command("dog", handleImageCommand);
bot.command("weather", handleWeatherCommand);

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
