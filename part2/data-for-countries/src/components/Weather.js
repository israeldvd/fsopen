import { useEffect, useState } from "react";
import weatherService from "../services/weather";

const Weather = ({ capitalName }) => {
  const [weatherCondition, setCapitalWeather] = useState(null);

  useEffect(() => {
    weatherService
      .getLocationWeatherCondition(capitalName)
      .then((condition) => {
        setCapitalWeather(condition);
      });
  }, [capitalName]);

  if (!weatherCondition) {
    return <p>Retrieving weather condition...</p>;
  }

  const windSpeed = weatherCondition.wind.speed;
  const iconSrc = weatherService.getIconImgSrc(
    weatherCondition.weather[0].icon
  );
  const weatherDescription = weatherCondition.weather[0].description;
  const celsiusTemperature = (+weatherCondition.main.temp - 273.15).toFixed(2);

  return (
    <section>
      <p>temperature: {celsiusTemperature} Celsius</p>
      <p>
        <img src={iconSrc} alt={weatherDescription}></img>
      </p>
      <p>wind: {windSpeed} m/s</p>
    </section>
  );
};

export default Weather;
