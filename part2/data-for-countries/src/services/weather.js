import axios from "axios";

const api_key = process.env.REACT_APP_WEATHER_API_KEY;
const conditionBaseUrl = "https://api.openweathermap.org/data/2.5/weather";
const iconBaseUrl = "https://openweathermap.org/img/wn";

const getLocationWeatherCondition = (locationName) => {
  const composedUrl = `${conditionBaseUrl}?q=${locationName}&appid=${api_key}`;
  const responseData = axios.get(composedUrl).then((response) => {
    return response.data;
  });

  return responseData;
};

const getIconImgSrc = (iconNum) => {
  return `${iconBaseUrl}/${iconNum}@2x.png`;
};

const exportedFunctios = {
  getLocationWeatherCondition,
  getIconImgSrc,
};

export default exportedFunctios;
