import axios from "axios";
import envVariables from "#config/index.js";

const { OPEN_WEATHER_KEY } = envVariables;

async function isValidCityName(name) {
  try {
    const options = {
      q: name,
      appid: OPEN_WEATHER_KEY,
      limit: 1,
    };
    const response = await axios.get(
      "http://api.openweathermap.org/geo/1.0/direct",
      {
        params: options,
      }
    );
    return response.data.length;
  } catch (error) {
    console.error(logMsgs.ERROR.FETCH, error.message);
  }
}

export { isValidCityName };
