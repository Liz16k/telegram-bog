const { Telegraf, Scenes, session } = require("telegraf");
const rateLimit = require("telegraf-ratelimit");
const mongoose = require("mongoose");
const { BOT_TOKEN, DATABASE_URL } = require("./config");
const { msgs: { GREETING, HELP },} = require("./config/constants");
const { handleImageCommand } = require("./controllers/imageController");
const { handleSubCommand } = require("./controllers/subscriptionController");
const { handleReccomendCommand } = require("./controllers/recommendController");
const { handleWeatherCommand } = require("./controllers/weatherController");
const { handleTaskCommand, handleMyTasksCommand} = require("./controllers/taskController");
const { weatherScene } = require("./scenes/weatherScene");
const { subMenuScene } = require("./scenes/subMenuScene");
const { unsubscribeScene } = require("./scenes/unsubscribeScene");
const { subscribeScene } = require("./scenes/subscribeScene");
const { recommendMenuScene } = require("./scenes/recommend/recommendMenuScene");
const { cafeScene } = require("./scenes/recommend/cafeScene");
const { attractionsScene } = require("./scenes/recommend/attractionsScene");
const { eventScene } = require("./scenes/recommend/eventsScene");
const { createTaskScene } = require("./scenes/tasks/createTaskScene");
const { myTasksScene } = require("./scenes/tasks/myTasksScene");
const { mySubsScene } = require("./scenes/mySubsScene");
const { weatherSheduler, taskSheduler } = require("./utils/shedulers");

const dbURL = `${DATABASE_URL}?retryWrites=true&w=majority`;
mongoose.connect(dbURL);
mongoose.connection.on("error", (err) => {
  console.error(undefined, "Error occurred during an attempt to establish connection with the database", err);
  process.exit(1);
});

mongoose.connection.on("open", () => {
  const bot = new Telegraf(BOT_TOKEN);
  const stage = new Scenes.Stage([
    weatherScene,
    subMenuScene,
    subscribeScene,
    unsubscribeScene,
    mySubsScene,
    recommendMenuScene,
    cafeScene,
    attractionsScene,
    eventScene,
    createTaskScene,
    myTasksScene,
  ]);

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
  bot.command("recommendation", handleReccomendCommand);
  bot.command("createTask", handleTaskCommand);
  bot.command("myTasks", handleMyTasksCommand);

  bot.launch();

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  weatherSheduler(bot);
  taskSheduler(bot);
});
