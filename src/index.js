import { Telegraf, Scenes, session } from "telegraf";
import rateLimit from "telegraf-ratelimit";
import mongoose from "mongoose";
import envVariables from "#config/index.js";
import { msgs, logMsgs } from "#config/constants.js";
import * as controllers from "#controllers/index.js";
import * as scenes from "#scenes/index.js";
import { taskSheduler } from "#shedulers/taskSheduler.js";
import { weatherSheduler } from "#shedulers/weatherSheduler.js";

const { GREETING, HELP, ERROR } = msgs;
const { BOT_TOKEN, DATABASE_URL } = envVariables;

const dbURL = `${DATABASE_URL}?retryWrites=true&w=majority`;

mongoose.connect(dbURL);
mongoose.connection.on("error", (err) => {
  console.error(logMsgs.ERROR.DB, logMsgs.DB.CONNECT, err);
  process.exit(1);
});

mongoose.connection.on("open", () => {
  const bot = new Telegraf(BOT_TOKEN);
  const stage = new Scenes.Stage(Object.values(scenes));

  const limitConfig = {
    window: 1000,
    limit: 1,
    onLimitExceeded: (ctx) => ctx.reply(ERROR.RATELIMIT),
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
  bot.command("create_task", controllers.handleTaskCommand);
  bot.command("my_tasks", controllers.handleMyTasksCommand);

  bot.launch();

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  weatherSheduler(bot);
  taskSheduler(bot);
});
