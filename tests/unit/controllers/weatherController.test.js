/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const WeatherController = require('../../../controllers/weatherController');
require('dotenv').config();

describe('TC-13 WeatherController', () => {


    const validStartPoint = '37.3405,-97.6768';
    const validEndPoint = '37.3500,-97.6769';
    const validApiKey = process.env.TOMMORROW_IO_API_KEY_TEST;

    const invalidStartPoint = 'invalid_start';
    const invalidEndPoint = 'invalid_end';
    const invalidApiKey = 'invalid_api_key';


    it('TC-13: Set valid startPoint, endPoint, and API key; a success message with valid message is returned', async () => {
        const weatherController = new WeatherController(validStartPoint, validEndPoint, validApiKey);
        const result = await weatherController.getWeatherMessage();

        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('html');
        expect(result.html).toContain('<th>Point</th>')
        expect(result.html).toContain('<th>Address</th>')
        expect(result.html).toContain('<th>Current Weather</th>')
        expect(result.html).toContain('<th>Weather in 1 hr</th>')
        expect(result.html).toContain('<th>Weather in 3 hrs</th>')

        expect(result.text).toContain('Point');
        expect(result.text).toContain('Address: ');
        expect(result.text).toContain('1hr: ');
        expect(result.text).toContain('3hr: ');



    }, 100000);


    it('TC-10: Set invalid startPoint and endPoint; a message is returned with error content', async () => {
        const weatherController = new WeatherController(invalidStartPoint, invalidEndPoint, validApiKey);
        const result = await weatherController.getWeatherMessage();

        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('html');
        expect(result.text).toContain('No weather data could be found due to an internal error')
        expect(result.html).toContain('<p>No weather could be found due to an internal error</p>');


    }, 10000);

    it('TC-10: Set invalid API key; a message is returned with error content', async () => {
        const weatherController = new WeatherController(validStartPoint, validEndPoint, invalidApiKey);
        const result = await weatherController.getWeatherMessage();

        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('html');
        expect(result.text).toContain('No weather data could be found due to an internal error')
        expect(result.html).toContain('<p>No weather could be found due to an internal error</p>');

    }, 10000);




});
