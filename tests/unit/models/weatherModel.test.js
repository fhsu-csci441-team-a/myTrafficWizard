/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const WeatherModel = require('../../../models/weatherModel');
require('dotenv').config();

describe('TC-14 WeatherModel', () => {
    const validPoint = '52.41072,4.84239';
    const validApiKey = process.env.TOMMORROW_IO_API_KEY_TEST;

    const invalidPoint = 'invalid_start';
    const invalidApiKey = 'invalid_api_key';

    it('TC-14: The weatherModel correctly calls the weather API, weather information is retrieved', async () => {
        const weatherModel = new WeatherModel(validPoint, validApiKey);
        const result = await weatherModel.getWeatherByInterval();

        expect(result).toHaveProperty('success', true);
        expect(result.data).toHaveProperty('time');
        expect(result.data).toHaveProperty('weatherCode');
        expect(result.data).toHaveProperty('temperature');

    });

    it('TC-14: The weatherModel incorrectly calls the weather API, the weather information is not retrieved and an error message is returned', async () => {

        const weatherModel = new WeatherModel(invalidPoint, invalidApiKey);
        const result = await weatherModel.getWeatherByInterval();
        expect(result).toHaveProperty('success', false);

    });

});
