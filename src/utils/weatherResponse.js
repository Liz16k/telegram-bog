import { iconMap } from "#config/constants.js";
import { msgs } from "#config/constants.js";

const { NOW, WIND } = msgs.WEATHER;

export const weatherResponse = (currentWeather) => {
  const {
    weather: [{ description, icon }],
    main: { temp },
    name,
    wind: { speed },
  } = currentWeather;
  return `${NOW} (${name}):
  ${iconMap[icon]} ${Math.round(temp)}°C,
  ${description}
  ${WIND} ${speed} m/s`;
};
