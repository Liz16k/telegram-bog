const axios = require("axios");
const { OPEN_WEATHER_KEY } = require("../config");

async function getWeather({ city, lat, lon }) {
  const options = {
    appid: OPEN_WEATHER_KEY,
    units: "metric",
    lang: "ru",
  };
  city ? (options.q = city) : ((options.lon = lon), (options.lat = lat));
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather`,
    { params: options }
  );
  return response.data;
}

module.exports = { getWeather };
