const axios = require("axios");
const { OPEN_WEATHER_KEY } = require("../config");

async function getWeather(city) {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_KEY}&units=metric&lang=ru}`
  );
  return response.data;
}

module.exports = { getWeather };
