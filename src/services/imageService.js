const axios = require("axios");
const { PEXELS_KEY } = require("../config");
const { getRandomNum } = require("../utils/getRandomNum");

async function getImgUrl(query) {
  try {
    const response = await axios.get(`https://api.pexels.com/v1/search`, {
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

module.exports = { getImgUrl };
