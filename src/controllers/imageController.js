import { getImgUrl } from "#services/imageService.js";

async function handleImageCommand(ctx) {
  const userMsg = await ctx.message.text.split(" ");
  const imgQuery = userMsg[0].slice(1);
  ctx.reply('Подождите. Загружаю изображение...')
  try {
    const imgUrl = await getImgUrl(imgQuery);
    imgUrl
      ? ctx.sendPhoto(imgUrl)
      : ctx.reply("Не удалось получить изображение. Попробуйте еще раз.");
  } catch (error) {
    ctx.reply("API response error \n" + error.response);
  }
}

export { handleImageCommand };
