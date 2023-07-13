const { ERROR } = require("../config/constants");
const { weatherResponse, errorAPIResponse } = require("../utils/responses");
const { getWeather } = require("../services/weatherService");

async function handleWeatherCommand(ctx) {
  const userMsg = ctx.message.text.split(" ");
  const city = userMsg.slice(1).join(" ") || "Minsk";

  try {
    const weatherData = await getWeather(city);
    ctx.reply(weatherResponse(weatherData));
  } catch (error) {
    ctx.reply(`${ERROR}\n(${errorAPIResponse(error)})`);
  }
}

module.exports = { handleWeatherCommand };
