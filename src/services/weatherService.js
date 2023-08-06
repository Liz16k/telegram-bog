import axios from "axios";
import envVariables from "#config/index.js";
const { OPEN_WEATHER_KEY } = envVariables;

async function getWeather({ city, lat, lon }) {
  const options = {
    appid: OPEN_WEATHER_KEY,
    units: "metric",
    lang: "ru",
  };
  if (lat & lon) {
    options.lon = lon;
    options.lat = lat;
  } else {
    options.q = city;
  }
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather`,
    { params: options }
  );
  return response.data;
}

async function getCityNameByCoordinates({ lat, lon }) {
  const options = {
    lat,
    lon,
    limit: 5,
    appid: OPEN_WEATHER_KEY,
  };
  const response = await axios.get(
    "http://api.openweathermap.org/geo/1.0/reverse",
    {
      params: options,
    }
  );
  return await response.data[0].local_names["ru"] ?? response.data[0].name;
}

export { getWeather, getCityNameByCoordinates };
