import { schedule } from "node-cron";
import { fetchSubscriptions } from "#services/subscriptionService.js";
import { getWeather } from "#services/weatherService.js";
import { iconMap, logMsgs } from "#config/constants.js";

const weatherSheduler = (bot) => {
  schedule(
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
            console.log(logMsgs.SUCCESS.MSG, "на", userId);
            [];
          })
          .catch((error) => {
            console.error(logMsgs.ERROR.MSG, "на", userId, error.message);
          });
      });
    });
  } catch (error) {
    console.error(logMsgs.ERROR.SHEDULER, error.message);
  }
};

export { weatherSheduler };
