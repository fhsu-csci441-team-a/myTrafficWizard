/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const TravelController = require('../../../controllers/travelController');
require('dotenv').config();

describe('TC-10 TravelController', () => {

    const validStartPoint = '37.3405,-97.6768';
    const validEndPoint = '38.0339,-96.9834';
    const validApiKey = process.env.TOMTOM_API_KEY;

    const invalidStartPoint = 'invalid_start';
    const invalidEndPoint = 'invalid_end';
    const invalidApiKey = 'invalid_api_key';

    it('TC-10: Set valid startPoint, endPoint, and API key; a success message with valid message is returned', async () => {
        const travelController = new TravelController(validStartPoint, validEndPoint, validApiKey);
        const result = await travelController.getTravelMessage();

        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('html');
        expect(result.html).toContain('<h3><b>Travel Times</b></h3>')
        expect(result.text).toContain('Travel Times:\nYour estimated travel time with live traffic conditions');



    });

    it('TC-10: Set invalid startPoint and endPoint; a message is returned with error content', async () => {
        const travelController = new TravelController(invalidStartPoint, invalidEndPoint, validApiKey);
        const result = await travelController.getTravelMessage();

        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('html');
        expect(result.html).toContain('The following error occurred')
        expect(result.text).toContain('The following error occurred');

    });

    it('TC-10: Set invalid API key; a message is returned with error content', async () => {
        const travelController = new TravelController(validStartPoint, validEndPoint, invalidApiKey);
        const result = await travelController.getTravelMessage();

        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('html');
        expect(result.html).toContain('The following error occurred')
        expect(result.text).toContain('The following error occurred');

    });

    it('TC-10: Create route without incidents; a message confirming no incidents is received', async () => {
        const travelController = new TravelController(validStartPoint, validStartPoint, validApiKey);
        const result = await travelController.getTravelMessage();

        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('html');
        expect(result.html).toContain('We have great news, no travel incidents were found in the areas close to or on your route.')
        expect(result.text).toContain('We have great news, no travel incidents were found in the areas close to or on your route.');

    });


});
