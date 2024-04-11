const WeatherModel = require('../models/weatherModel');
const RouteMappingService = require('../services/routeMappingService');
const ReverseGeoCode = require('../services/reverseGeocode');

class WeatherController {


    #start;
    #end;
    #routeMappingService;
    #reverseGeocode;
    #weatherModel;
    #wayPoints;
    #weatherObjects;


    constructor(start, end, weatherAPIKey, routeAPIKey) {
        this.#start = start;
        this.#end = end;
        this.#routeMappingService = new RouteMappingService(start, end);
        this.#weatherModel = new WeatherModel(start, weatherAPIKey);
        this.#reverseGeocode = new ReverseGeoCode(routeAPIKey);


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
            let weather30minutes = await this.#weatherModel.getWeatherByInterval('minutely', 29);
            let weather1hour = await this.#weatherModel.getWeatherByInterval('hourly', 0);
            let weather2hour = await this.#weatherModel.getWeatherByInterval('hourly', 1);
            let addressTranslation = await this.#reverseGeocode.getAddress(point);


            let weatherObject = {
                "point": point,
                "current": weatherCurrent.data,
                "minutes30": weather30minutes.data,
                "hour1": weather1hour.data,
                "hour2": weather2hour.data,
                "address": addressTranslation.data
            };

            data.push(weatherObject);

            await this.#delay(5000);
        }

        this.#weatherObjects = data;
    }

    async #generateTemplateText() {
        const data = this.#weatherObjects;
        let template = "Weather Forecast Report\n\n";

        data.forEach((element, index) => {
            let line = `Point ${index + 1}: `;
            line += `Address: ${element.address} | `;
            line += `Current: ${this.#formatWeather(element.current)} | `;
            line += `30min: ${this.#formatWeather(element.minutes30)} | `;
            line += `1hr: ${this.#formatWeather(element.hour1)} | `;
            line += `2hr: ${this.#formatWeather(element.hour2)}`;
            template += line;
            template += "\n";
        });

        return template;
    }

    async #generateTemplateHTML() {

        const data = this.#weatherObjects;
        let template = `
            <table>
                <tr>
                    <th>Point</th>
                    <th>Address</th>
                    <th>Current Weather</th>
                    <th>Weather in 30 min</th>
                    <th>Weather in 1 hr</th>
                    <th>Weather in 2 hrs</th>
                </tr>`;

        data.forEach((element, index) => {
            template += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${element.address}</td>
                    <td>${this.#formatWeather(element.current)}</td>
                    <td>${this.#formatWeather(element.minutes30)}</td>
                    <td>${this.#formatWeather(element.hour1)}</td>
                    <td>${this.#formatWeather(element.hour2)}</td>
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
            return { "text": null, "htmlMessage": null };
        }

    }



}

module.exports = WeatherController;