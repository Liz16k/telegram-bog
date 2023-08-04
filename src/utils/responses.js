const weatherResponse = (weatherData) => {
  const city = weatherData.name;
  const country = weatherData.sys.country;
  const temperature = weatherData.main.temp;
  const description = weatherData.weather[0].description;
  return `Текущая погода в ${city}(${country}): \nТемпература: ${temperature}°C, \n(${description})`;
};

const errorAPIResponse = (error) => error?.response?.data?.message;

export { weatherResponse, errorAPIResponse };
