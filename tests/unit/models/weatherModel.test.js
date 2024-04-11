const WeatherModel = require('../../../models/weatherModel');
require('dotenv').config();



const apiKey = 'ljBGQOoZnk05ad4M5fL8Hh9EzKsE8x9o';
const start = '52.41072,4.84239';
console.log(apiKey);
const weatherModel = new WeatherModel(start, apiKey);

async function displayWeather() {
    try {
        // Use the method to get the weather for a specific interval
        const weatherData = await weatherModel.getWeatherByInterval('hourly', 3);
        console.log(weatherData);
    } catch (error) {
        console.error('Failed to get weather data:', error);
    }
}

