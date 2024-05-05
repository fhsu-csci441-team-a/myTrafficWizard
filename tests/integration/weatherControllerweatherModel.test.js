/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const WeatherController = require('../../controllers/weatherController');
const WeatherModel = require('../../models/weatherModel');
require('dotenv').config();

jest.mock('../../models/weatherModel');

describe('Integration Test: weatherController=>weatherModel', () => {


    it('weatherController calls the weatherModel for data about the weather', async () => {

        const start = '37.3405,-97.6768';
        const end = '37.3405,-97.6769';


        const mockWeatherModel = new WeatherModel();
        mockWeatherModel.getWeatherByInterval = jest.fn().mockResolvedValue({
            data: {
                time: '2024-01-01T00:00:00Z',
                weatherCode: '1000',
                temperature: '72'
            },
            message: null
        });

        const weatherController = new WeatherController(
            start,
            end,
            '123456',
            '78910',
            mockWeatherModel
        )


        const result = await weatherController.getWeatherMessage();

        expect(mockWeatherModel.getWeatherByInterval).toHaveBeenCalledTimes(6);
        expect(result.text).toContain('72');
        expect(result.html).toContain('<table>');


    }, 20000);



});