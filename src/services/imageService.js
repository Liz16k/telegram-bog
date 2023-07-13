const axios = require("axios");
const { PEXELS_KEY } = require("../config");
const { getRandomNum } = require("../utils/getRandomNum");

async function getImgUrl(query) {
  const response = await axios.get(
    `https://api.pexels.com/v1/search?query=${query}`,
    {
      headers: { Authorization: PEXELS_KEY },
    }
  );
  return response.data.photos[getRandomNum(15)].url;
}

module.exports = { getImgUrl };
