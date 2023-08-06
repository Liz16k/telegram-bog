import { getImgUrl } from "#services/imageService.js";
import { logMsgs, msgs } from "#config/constants.js";

async function handleImageCommand(ctx) {
  try {
    await ctx.reply(msgs.WAIT.IMG);
    const userMsg = await ctx.message.text.split(" ");
    const imgQuery = userMsg[0].slice(1);
    const imgUrl = await getImgUrl(imgQuery);
    await ctx.sendPhoto(imgUrl);
  } catch (error) {
    ctx.reply(msgs.ERROR.IMG);
    console.error(logMsgs.ERROR.HANDLE.IMG, error.message);
  }
}

export { handleImageCommand };
