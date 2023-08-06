import axios from "axios";
import envVariables from "#config/index.js";
import { logMsgs } from "#config/constants";
const { GEOAPIFY_KEY, FOURSQUARE_KEY } = envVariables;

async function cafeSearch(args) {
  const categories = "catering.cafe";
  return await placeSearch({ ...args, categories });
}

async function attractionsSearch(args) {
  const categories = "tourism.sights";
  return await placeSearch({ ...args, categories });
}

async function eventsSearch({ lat, lon, city }) {
  try {
    let params = {
      categories: 14000,
      limit: 8,
    };
    city ? (params.near = city) : (params.ll = `${lat},${lon}`);

    const response = await axios.get(
      `https://api.foursquare.com/v3/places/search`,
      {
        headers: {
          accept: "application/json",
          Authorization: FOURSQUARE_KEY,
        },
        params,
      }
    );
    return response.data;
  } catch (error) {
    console.error(logMsgs.ERROR.FETCH, error.message);
  }
}

async function placeSearch({ lat, lon, categories }) {
  try {
    const options = {
      apiKey: GEOAPIFY_KEY,
      bias: `proximity:${lon},${lat}`,
      filter: `circle:${lon},${lat},1500`,
      categories,
      conditions: "named,access",
      limit: 5,
      lang: "ru",
    };
    const response = await axios.get("https://api.geoapify.com/v2/places", {
      params: options,
    });
    return await response.data.features;
  } catch (error) {
    console.log(logMsgs.ERROR.FETCH, error.message);
  }
}

export { placeSearch, cafeSearch, attractionsSearch, eventsSearch };
