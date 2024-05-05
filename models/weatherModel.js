/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

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

    /**
     * Converts a temperature from Celsius to Fahrenheit.
     * This is a static method, meaning it can be called on the class itself rather than on instances of the class.
     *
     * @param {number} celsius - The temperature in degrees Celsius.
     * @returns {number} The temperature converted to degrees Fahrenheit.
     */

    static #celsiusToFahrenheit(celsius) {
        return (celsius * 9 / 5) + 32;
    }



    /**
     * Constructs a response object indicating a successful operation.
     * This method is commonly used to standardize the format of successful responses throughout the application.
     *
     * @param {any} data - The payload to be included in the success message. This can be any type of data resulting from the operation.
     * @param {string|null} [message=null] - An optional message providing more details about the success, defaults to null if not provided.
     * @returns {Object} An object structured to indicate success, containing the provided data and an optional message.
     */
    #messageOperationSuccess(data, message = null) {
        return {
            success: true,
            data: data,
            message: message
        }
    }

    /**
     * Constructs a response object indicating an operation failure.
     * This method is used to standardize the format of error responses throughout the application.
     *
     * @param {Error|string} error - The error encountered during the operation, described either as a string or an Error object.
     * @returns {Object} An object structured to indicate failure, containing no data and an error message.
     */

    #messageOperationFailure(error) {
        return {
            success: false,
            data: null,
            message: `An error has occurred: ${error}`
        };
    }

    /**
     * Validates and potentially adjusts the interval number based on the interval type specified.
     * Ensures that the interval number does not exceed the maximum allowable value for the given type.
     *
     * @param {string} type - The type of interval, such as 'minutely' or 'hourly'.
     * @param {number} number - The interval number to validate.
     * @returns {number} The validated interval number, adjusted if necessary to conform to maximum limits.
     */

    #validateInterval(type, number) {
        if (type === 'minutely' && number > 120) return 120;

        if (type === 'hourly' && number > 60) return 60;

        return number;
    }

    /**
     * Sets the geographic point for weather data retrieval and initializes the process to fetch weather timelines.
     *
     * @param {string} point - A string representing a geographic location, usually in "latitude,longitude" format.
     */

    async setPoint(point) {
        this.url = `https://api.tomorrow.io/${WeatherModel.VERSION}/weather/forecast?location=${point}&apikey=${this.#apiKey}`;
        await this.#getTimelines();
    }



    /**
     * Fetches and stores weather timelines from a remote API based on the previously set geographic point.
     * This method updates the internal state with the fetched timelines.
     */
    async #getTimelines() {
        const result = await this.fetchWithRetry();
        this.#timelines = result.timelines;

    }

    /**
     * Asynchronously retrieves weather data for a specified interval and interval number.
     * Handles fetching, validating intervals, and structuring the response.
     *
     * @param {string} [type='minutely'] - The type of interval to retrieve data for ('minutely', 'hourly').
     * @param {number} [number=0] - The specific interval number to retrieve, with defaulting to the first interval.
     * @returns {Promise<Object>} A promise that resolves to a message operation success object containing the weather data, or a failure object if an error occurs.
     */

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