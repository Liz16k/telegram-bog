const { Telegraf } = require("telegraf");
const rateLimit = require("telegraf-ratelimit");
const axios = require("axios");
require("dotenv").config({ path: `.env.local` });

const bot = new Telegraf(process.env.BOT_TOKEN);
const limitConfig = {
  window: 3000,
  limit: 1,
  onLimitExceeded: (ctx, next) => ctx.reply("Rate limit exceeded"),
};

bot.use(rateLimit(limitConfig));

bot.start(ctx=>ctx.reply('Привет. Я многофункциональный бот. Для получения списка команд используйте /help'))
bot.help(ctx=>ctx.reply('Список команд:\n/weather - получить текущую погоду\n/cat - получить картинку кошки\n/dog - получить картинку собаки'))

bot.launch();
