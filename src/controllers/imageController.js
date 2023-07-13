const { getImgUrl } = require("../services/imageService");
const { errorAPIResponse } = require("../utils/responses");

async function handleImageCommand(ctx) {
  const userMsg = ctx.message.text.split(" ");
  const imgQuery = userMsg[0].slice(1);

  try {
    const imgUrl = await getImgUrl(imgQuery);
    ctx.sendPhoto(imgUrl);
  } catch (error) {
    ctx.reply(errorAPIResponse(error));
  }
}

module.exports = { handleImageCommand };
