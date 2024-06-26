/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/


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


    constructor(start, end, tommorowIOAPIKey, TomTomAPIKey, weatherModel = null) {
        this.#routeMappingService = new RouteMappingService(start, end);
        this.#weatherModel = weatherModel || new WeatherModel(start, tommorowIOAPIKey);
        this.#reverseGeocode = new ReverseGeocode(TomTomAPIKey);
    }

    /**
     * Sets the waypoints for the current instance by generating them using the route mapping service.
     * This method updates the internal state of the instance with newly generated waypoints.
     */

    #setWayPoints() {
        this.#wayPoints = this.#routeMappingService.generateWayPoints();
    }


    /**
     * Creates a promise that resolves after a specified number of milliseconds, effectively pausing execution.
     * 
     * @param {number} milliseconds - The number of milliseconds to delay.
     * @returns {Promise<void>} A promise that resolves after the delay, providing a simple way to implement asynchronous delays.
     */

    #delay(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }


    /**
     * Asynchronously generates weather objects for each waypoint by fetching weather data and associated address information.
     * This method populates the internal state with weather data for each waypoint including current, 1-hour, and 3-hour forecasts.
     */
    async #generateWeatherObjects() {
        this.#setWayPoints();

        const data = []

        for (const wayPoint of this.#wayPoints) {
            let latitude = wayPoint[1];
            let longitude = wayPoint[0];

            let point = `${latitude},${longitude}`


            await this.#weatherModel.setPoint(point);
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

    /**
     * Asynchronously generates a plain text template that summarizes the weather data for each waypoint.
     * The template includes address information and weather forecasts at current, 1-hour, and 3-hour intervals.
     * 
     * @returns {Promise<string>} A string that represents the weather data in a structured text format.
     */
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

    /**
     * Asynchronously generates an HTML template that summarizes the weather data for each waypoint.
     * The template includes a table with columns for point index, address, current weather, and forecasts for 1 and 3 hours.
     * 
     * @returns {Promise<string>} An HTML string that represents the weather data in a structured table format.
     */
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

    /**
     * Formats a weather data object into a human-readable string including a weather symbol, code, and temperature.
     * 
     * @param {Object} weather - A weather data object containing at least weatherCode and temperature properties.
     * @returns {string} A formatted string representing the weather with symbols and units.
     */
    #formatWeather(weather) {
        const weatherSymbol = this.#getWeatherSymbol(weather.weatherCode);
        return `${weatherSymbol}  ${weather.weatherCode} ${weather.temperature}°F`;
    }

    /**
     * Retrieves a weather symbol based on a given weather code. Maps weather conditions to emojis.
     * 
     * @param {string} weatherCode - A code that represents a specific weather condition.
     * @returns {string} An emoji or symbol representing the weather condition.
     */

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

    /**
     * Asynchronously retrieves weather information and generates both HTML and plain text messages summarizing the weather conditions.
     * The method handles errors internally, returning a predefined error message if the data fetch fails.
     * 
     * @returns {Promise<Object>} An object containing both text and HTML formatted weather messages.
     */
    async getWeatherMessage() {
        try {
            await this.#generateWeatherObjects();
            const htmlMessage = await this.#generateTemplateHTML();
            const textMessage = await this.#generateTemplateText();

            return { "text": textMessage, "html": htmlMessage };
        }
        catch (error) {
            return { "text": "No weather data could be found due to an internal error", "html": "<p>No weather could be found due to an internal error</p>" };
        }

    }



}

module.exports = WeatherController;