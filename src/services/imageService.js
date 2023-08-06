import axios from "axios";
import envVariables from "#config/index.js";
import { getRandomNum } from "#utils/getRandomNum.js";
import { msgs, logMsgs } from "#config/constants.js";

const { PEXELS_KEY } = envVariables;
async function getImgUrl(query) {
  try {
    const response = await axios.get(`https://api.pexels.com/v1/search`, {
      headers: { Authorization: PEXELS_KEY },
      params: {
        query,
        per_page: 1,
        page: getRandomNum(1000),
      },
    });
    return await response.data.photos[0].src.large2x;
  } catch (error) {
    ctx.reply(msgs.ERROR.IMG);
    console.error(logMsgs.ERROR.FETCH, error.message);
  }
}

export { getImgUrl };
