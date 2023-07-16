const { Telegraf } = require("telegraf");
const rateLimit = require("telegraf-ratelimit");
const { BOT_TOKEN } = require("./config");
const { GREETING, HELP } = require("./config/constants");
const { handleWeatherCommand } = require("./controllers/weatherController");
const { handleImageCommand } = require("./controllers/imageController");

const bot = new Telegraf(BOT_TOKEN);
const limitConfig = {
  window: 3000,
  limit: 1,
  onLimitExceeded: (ctx) => ctx.reply("Rate limit exceeded"),
};

bot.use(rateLimit(limitConfig));

bot.start((ctx) => ctx.reply(GREETING));
bot.help((ctx) => ctx.reply(HELP));

bot.command("weather", handleWeatherCommand);
bot.command("cat", handleImageCommand);
bot.command("dog", handleImageCommand);

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
