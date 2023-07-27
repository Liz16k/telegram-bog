const { Telegraf, Scenes, session } = require("telegraf");
const rateLimit = require("telegraf-ratelimit");
const { BOT_TOKEN, DATABASE_URL } = require("./config");
const {
  msgs: { GREETING, HELP },
} = require("./config/constants");
const { handleImageCommand } = require("./controllers/imageController");
const { handleWeatherCommand } = require("./controllers/weatherController");
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
const { handleSubCommand } = require("./controllers/subscriptionController");
const { handleReccomendCommand } = require("./controllers/recommendController");
const {
  handleTaskCommand,
  handleMyTasksCommand,
} = require("./controllers/taskController");
const { fetchSubscriptions } = require("./services/subscriptionService");
const { iconMap } = require("./config/constants");
const { getWeather } = require("./services/weatherService");
const mongoose = require("mongoose");
const { mySubsScene } = require("./scenes/mySubsScene");

const dbURL = `${DATABASE_URL}?retryWrites=true&w=majority`;
mongoose.connect(dbURL);
mongoose.connection.on("error", (err) => {
  console.error(
    undefined,
    `Error occurred during an attempt to establish connection with the database`,
    err
  );
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

  const cron = require("node-cron");

  cron.schedule(
    "0 9 * * *",
    async () => {
      try {
        const docs = await fetchSubscriptions();
        docs.forEach(async (subscriber) => {
          subscriber.subscriptions.forEach(async (sub) => {
            const { lat, lon, city } = sub.location;
            let params = {
              city,
            };
            if (lat & lon) {
              params.lat = lat;
              params.lon = lon;
            }

            const currentWeather = await getWeather(params);
            const {
              weather: [{ description, icon }],
              main: { temp },
              name,
              wind: { speed },
            } = currentWeather;
            const userId = subscriber.userId;
            const messageText = `
        Погода сейчас (${name}):
        ${iconMap[icon]} ${Math.round(temp)}°C,
        ${description}
        Ветер: ${speed} м/с
        `;

            bot.telegram
              .sendMessage(userId, messageText)
              .then(() => {
                console.log(
                  `Сообщение успешно отправлено на userId: ${userId}`
                );
                [];
              })
              .catch((error) => {
                console.error(
                  `Не удалось отправить сообщение на userId: ${userId}`,
                  error.message
                );
              });
          });
        });
      } catch (error) {
        console.log(error.message);
      }
    },
    {
      timezone: "Europe/Minsk",
    }
  );
});
