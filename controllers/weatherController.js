/**
 * The WeatherController class orchestrates the gathering and presentation of weather data for specific routes.
 * It utilizes services for mapping routes, fetching weather data, and performing reverse geocoding to enhance the data
 * with human-readable addresses. The class is designed to fetch weather forecasts for waypoints along a defined start
 * and end geographical point and provides the data in both text and HTML formats.
 *
 *
 * Example Usage:
 * const weatherController = new WeatherController('34.0522,-118.2437', '36.7783,-119.4179', 'tommorowIOAPIKey', 'TomTomAPIKey');
 * weatherController.getWeatherMessage()
 *   .then(messages => {
 *     console.log("Text Message:", messages.text);
 *     console.log("HTML Message:", messages.html);
 *   })
 *   .catch(error => console.error("Error fetching weather messages:", error));
 * 
 */

const WeatherModel = require('../models/weatherModel');
const RouteMappingService = require('../services/routeMappingService');
const ReverseGeocode = require('../services/reverseGeocode');

class WeatherController {

    #routeMappingService;
    #reverseGeocode;
    #weatherModel;
    #wayPoints;
    #weatherObjects;


    constructor(start, end, tommorowIOAPIKey, TomTomAPIKey) {
        this.#routeMappingService = new RouteMappingService(start, end);
        this.#weatherModel = new WeatherModel(start, tommorowIOAPIKey);
        this.#reverseGeocode = new ReverseGeocode(TomTomAPIKey);
    }

    #setWayPoints() {
        this.#wayPoints = this.#routeMappingService.generateWayPoints();
    }

    #delay(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async #generateWeatherObjects() {
        this.#setWayPoints();

        const data = []

        for (const wayPoint of this.#wayPoints) {
            let latitude = wayPoint[1];
            let longitude = wayPoint[0];

            let point = `${latitude},${longitude}`


            this.#weatherModel.setPoint(point);
            let weatherCurrent = await this.#weatherModel.getWeatherByInterval('minutely', 0);
            let weather1hour = await this.#weatherModel.getWeatherByInterval('hourly', 0);
            let weather3hour = await this.#weatherModel.getWeatherByInterval('hourly', 2);
            let addressTranslation = await this.#reverseGeocode.getAddress(point);


            let weatherObject = {
                "point": point,
                "current": weatherCurrent.data,
                "hour1": weather1hour.data,
                "hour3": weather3hour.data,
                "address": addressTranslation.data
            };

            data.push(weatherObject);


            await this.#delay(5000);
        }

        this.#weatherObjects = data;
    }

    async #generateTemplateText() {
        const data = this.#weatherObjects;
        let template = "\n\n";

        data.forEach((element, index) => {
            let line = `Point ${index + 1}: `;
            line += `Address: ${element.address} | `;
            line += `Current: ${this.#formatWeather(element.current)} | `;
            line += `1hr: ${this.#formatWeather(element.hour1)} | `;
            line += `3hr: ${this.#formatWeather(element.hour3)}`;
            template += line;
            template += "\n";
        });

        return template;
    }

    async #generateTemplateHTML() {

        const data = this.#weatherObjects;
        let template = `
        <style>
        table {
            width: 80%;
            margin: 20px auto;
            border-collapse: collapse;
            text-align: left;
        }
        th, td {
            padding: 8px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
            color: #333;
        }
        </style>
        <table>
            <thead>
                <tr>
                    <th>Point</th>
                    <th>Address</th>
                    <th>Current Weather</th>
                    <th>Weather in 1 hr</th>
                    <th>Weather in 3 hrs</th>
                </tr>
            </thead>
            <tbody>`;

        data.forEach((element, index) => {
            template += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${element.address}</td>
                    <td>${this.#formatWeather(element.current)}</td>
                    <td>${this.#formatWeather(element.hour1)}</td>
                    <td>${this.#formatWeather(element.hour3)}</td>
                </tr>`;
        });

        template += `</table>`;
        return template;
    }

    #formatWeather(weather) {
        const weatherSymbol = this.#getWeatherSymbol(weather.weatherCode);
        return `${weatherSymbol}  ${weather.weatherCode} ${weather.temperature}°F`;
    }


    #getWeatherSymbol(weatherCode) {
        const symbols = {
            "Unknown": "❓",
            "Clear, Sunny": "☀️",
            "Mostly Clear": "🌤",
            "Partly Cloudy": "⛅",
            "Mostly Cloudy": "🌥",
            "Cloudy": "☁️",
            "Fog": "🌫",
            "Light Fog": "🌁",
            "Drizzle": "🌦",
            "Rain": "🌧",
            "Light Rain": "🌦",
            "Heavy Rain": "🌧",
            "Snow": "❄️",
            "Flurries": "🌨",
            "Light Snow": "🌨",
            "Heavy Snow": "❄️",
            "Freezing Drizzle": "🌧❄️",
            "Freezing Rain": "🌧❄️",
            "Light Freezing Rain": "🌧❄️",
            "Heavy Freezing Rain": "🌧❄️",
            "Ice Pellets": "🌨",
            "Heavy Ice Pellets": "🌨",
            "Light Ice Pellets": "🌨",
            "Thunderstorm": "⛈",
        };


        return symbols[weatherCode] || "❓";
    }

    async getWeatherMessage() {
        try {
            await this.#generateWeatherObjects();
            const htmlMessage = await this.#generateTemplateHTML();
            const textMessage = await this.#generateTemplateText();

            return { "text": textMessage, "html": htmlMessage };
        }
        catch (error) {
            return { "text": error, "htmlMessage": error };
        }

    }



}

module.exports = WeatherController;