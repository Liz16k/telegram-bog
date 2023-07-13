const { Telegraf } = require("telegraf");
const rateLimit = require("telegraf-ratelimit");
const axios = require("axios");
require("dotenv").config({ path: `.env.local` });

const bot = new Telegraf(process.env.BOT_TOKEN);
const limitConfig = {
  window: 3000,
  limit: 1,
  onLimitExceeded: (ctx) => ctx.reply("Rate limit exceeded"),
};

bot.use(rateLimit(limitConfig));

bot.start((ctx) =>
  ctx.reply(
    "Привет. Я многофункциональный бот. Для получения списка команд используйте /help"
  )
);

bot.help((ctx) =>
  ctx.reply(
    "Список команд:\n/weather - получить текущую погоду\n/cat - получить картинку кошки\n/dog - получить картинку собаки"
  )
);

bot.command("weather", async (ctx) => {
  const userMsg = ctx.message.text.split(" ");
  const city = userMsg.length > 1 ? userMsg.slice(1).join(" ") : "Minsk";

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_KEY}&units=metric&lang=ru}`
    );
    const weatherData = response.data;

    const temperature = weatherData.main.temp;
    const description = weatherData.weather[0].description;
    const message = `Текущая погода в ${city}: \nТемпература: ${temperature}°C, \n(${description})`;
    ctx.reply(message);
  } catch (error) {
    ctx.reply(
      `Не удалось получить данные о погоде. Попробуйте еще раз позже. (${error.response.data.message})`
    );
  }
});

bot.launch();
