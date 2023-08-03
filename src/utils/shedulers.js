const { fetchSubscriptions } = require("../services/subscriptionService");
const { iconMap } = require("../config/constants");
const { getWeather } = require("../services/weatherService");
const { fetchUsersTasks } = require("../services/taskService");
const cron = require("node-cron");

const tasksShedulers = {};

const createTaskScheduler = ({ ctx, bot, task, userId }) => {
  task ??= ctx.wizard.state;
  bot ??= ctx.bot;
  userId ??= ctx.update.callback_query.from.id;
  const { name, interval } = task;
  return cron.schedule(
    `0 */${interval} * * *`,
    () => {
      bot.telegram
        .sendMessage(userId, `Пора выполнить задачу: ${name}`)
        .then(() => {
          console.log(`Сообщение успешно отправлено на userId: ${userId}`);
        })
        .catch((error) => {
          console.error(
            `Не удалось отправить сообщение на userId: ${userId}`,
            error.message
          );
        });
    },
    {
      timezone: "Europe/Minsk",
    }
  );
};

const taskSheduler = async (bot) => {
  const usersTasks = await fetchUsersTasks();
  usersTasks.forEach(async (user) => {
    const userId = user.userId;
    user.tasks
      .filter((task) => task.reminder)
      .forEach((task) => {
        const shedule = createTaskScheduler({ bot, task, userId });
        task.shedulerId = shedule.options.name;
        tasksShedulers[shedule.options.name];
      });
    await user.save();
  });
};

const weatherSheduler = (bot) => {
  cron.schedule(
    "0 9 * * *",
    () => {
      weatherNotificate(bot);
    },
    {
      timezone: "Europe/Minsk",
    }
  );
};

const weatherNotificate = async (bot) => {
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
            console.log(`Сообщение успешно отправлено на userId: ${userId}`);
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
};

module.exports = { weatherSheduler, taskSheduler, createTaskScheduler };
