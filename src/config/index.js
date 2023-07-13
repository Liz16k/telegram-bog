require("dotenv").config({ path: `.env.local` });

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  OPEN_WEATHER_KEY: process.env.OPEN_WEATHER_KEY,
};
