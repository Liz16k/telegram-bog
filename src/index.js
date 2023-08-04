import { Telegraf, Scenes, session } from "telegraf";
import rateLimit from "telegraf-ratelimit";
import { connect, connection } from "mongoose";
import { BOT_TOKEN, DATABASE_URL } from "./config";
import constants from "./config/constants";
import * as controllers from "./controllers";
import { weatherScene } from "./scenes/weather/weatherScene";
import { mySubsScene, subscribeScene, subMenuScene, unsubscribeScene } from "./scenes/subs";
import { recommendMenuScene, attractionsScene, cafeScene, eventScene } from "./scenes/recommend";
import { createTaskScene, myTasksScene } from "./scenes/tasks";
import { weatherSheduler, taskSheduler } from "./shedulers/shedulers";
const {
  msgs: { GREETING, HELP },
} = constants;

const dbURL = `${DATABASE_URL}?retryWrites=true&w=majority`;
connect(dbURL);
connection.on("error", (err) => {
  console.error(
    undefined,
    "Error occurred during an attempt to establish connection with the database",
    err
  );
  process.exit(1);
});

connection.on("open", () => {
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

  bot.command("cat", controllers.handleImageCommand);
  bot.command("dog", controllers.handleImageCommand);
  bot.command("weather", controllers.handleWeatherCommand);
  bot.command("subscription", controllers.handleSubCommand);
  bot.command("recommendation", controllers.handleReccomendCommand);
  bot.command("createTask", controllers.handleTaskCommand);
  bot.command("myTasks", controllers.handleMyTasksCommand);

  bot.launch();

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  weatherSheduler(bot);
  taskSheduler(bot);
});
