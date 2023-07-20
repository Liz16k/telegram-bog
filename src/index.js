const { Telegraf, Scenes, session } = require("telegraf");
const rateLimit = require("telegraf-ratelimit");
const { BOT_TOKEN } = require("./config");
const {
  msgs: { GREETING, HELP },
} = require("./config/constants");
const { handleImageCommand } = require("./controllers/imageController");
const { handleWeatherCommand } = require("./controllers/weatherController");
const { weatherScene } = require("./scenes/weatherScene");
const { subMenuScene } = require("./scenes/subMenuScene");
const { unsubscribeScene } = require("./scenes/unsubscribeScene");
const { subscribeScene } = require("./scenes/subscribeScene");

const { handleSubCommand } = require("./controllers/subscriptionController");
const mongoose = require("mongoose");

const bot = new Telegraf(BOT_TOKEN);
const stage = new Scenes.Stage([
  weatherScene,
  subMenuScene,
  subscribeScene,
  unsubscribeScene,
]);

const dbURL =
  "mongodb+srv://liz:admin@dbfortgchatbot.zaprkms.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(dbURL);

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
bot.command("subscription", handleSubCommand);

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
