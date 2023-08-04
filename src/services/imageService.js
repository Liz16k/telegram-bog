import { get } from "axios";
import { PEXELS_KEY } from "../config";
import { getRandomNum } from "../utils/getRandomNum";

async function getImgUrl(query) {
  try {
    const response = await get(`https://api.pexels.com/v1/search`, {
      headers: { Authorization: PEXELS_KEY },
      params: {
        query,
        per_page: 1,
        page: getRandomNum(100),
      },
    });
    return response.data.photos[0].src.original;
  } catch (error) {
    ctx.reply("Не удалось получить изображение. Попробуйте еще раз.");
  }
}

export default { getImgUrl };
