/**
 * Manages weather data retrieval and processing for specific geographic points using the Tomorrow.io API.
 * This class extends `BaseFetchRetry` to handle API requests with automatic retries on failure.
 *
 * Usage example:
 *   const weatherModel = new WeatherModel("40.7128,-74.0060", "your_api_key_here");
 *   await weatherModel.setPoint("40.7128,-74.0060");
 *   const currentWeather = await weatherModel.getWeatherByInterval('minutely', 1);
 *   console.log(currentWeather);
 */

const BaseFetchRetry = require('../services/BaseFetchRetry');

class WeatherModel extends BaseFetchRetry {


    static VERSION = 'v4';
    static HEADERS = { "Accept": "application/json", "Content-Type": "application/json" };
    #timelines;
    #apiKey;

    static #weatherCode = {
        "0": "Unknown",
        "1000": "Clear, Sunny",
        "1100": "Mostly Clear",
        "1101": "Partly Cloudy",
        "1102": "Mostly Cloudy",
        "1001": "Cloudy",
        "2000": "Fog",
        "2100": "Light Fog",
        "4000": "Drizzle",
        "4001": "Rain",
        "4200": "Light Rain",
        "4201": "Heavy Rain",
        "5000": "Snow",
        "5001": "Flurries",
        "5100": "Light Snow",
        "5101": "Heavy Snow",
        "6000": "Freezing Drizzle",
        "6001": "Freezing Rain",
        "6200": "Light Freezing Rain",
        "6201": "Heavy Freezing Rain",
        "7000": "Ice Pellets",
        "7101": "Heavy Ice Pellets",
        "7102": "Light Ice Pellets",
        "8000": "Thunderstorm"
    };

    constructor(point, apiKey) {

        const url = `https://api.tomorrow.io/${WeatherModel.VERSION}/weather/forecast?location=${point}&apikey=${apiKey}`;
        super(url, { method: "GET", headers: WeatherModel.HEADERS });

        this.#apiKey = apiKey;

    }

    static #celsiusToFahrenheit(celsius) {
        return (celsius * 9 / 5) + 32;
    }

    #messageOperationSuccess(data, message = null) {
        return {
            success: true,
            data: data,
            message: message
        }
    }


    #messageOperationFailure(error) {
        return {
            success: false,
            data: null,
            message: `An error has occurred: ${error}`
        };
    }

    #validateInterval(type, number) {
        if (type === 'minutely' && number > 120) return 120;

        if (type === 'hourly' && number > 60) return 60;

        return number;
    }

    async setPoint(point) {
        this.url = `https://api.tomorrow.io/${WeatherModel.VERSION}/weather/forecast?location=${point}&apikey=${this.#apiKey}`;
        await this.#getTimelines();
    }



    async #getTimelines() {
        const result = await this.fetchWithRetry();
        this.#timelines = result.timelines;

    }

    async getWeatherByInterval(type = 'minutely', number = 0) {
        try {
            if (!this.#timelines) {
                await this.#getTimelines();
            }

            const validatedNumber = this.#validateInterval(type, number);
            const timelineSegment = this.#timelines[type];
            const interval = timelineSegment[validatedNumber];
            const values = interval.values;

            const data =
            {
                "time": interval.time,
                "weatherCode": WeatherModel.#weatherCode[values.weatherCode],
                "temperature": Math.round((WeatherModel.#celsiusToFahrenheit(values.temperature)), 0)
            };

            return this.#messageOperationSuccess(data);

        }
        catch (error) {
            return this.#messageOperationFailure(error);

        }

    }





}

module.exports = WeatherModel;