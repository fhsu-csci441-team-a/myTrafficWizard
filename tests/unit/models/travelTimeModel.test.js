const TravelTimeModel = require('../../../models/travelTimeModel');
require('dotenv').config();

describe('TC-11 TravelTimeModel', () => {
    const validStartPoint = '52.41072,4.84239';
    const validEndPoint = '52.377956,4.897070';
    const validApiKey = process.env.TOMTOM_API_KEY;

    const invalidStartPoint = 'invalid_start';
    const invalidEndPoint = 'invalid_end';
    const invalidApiKey = 'invalid_api_key';

    it('TC-11: Instantiates object with valid startPoint, endPoint, and API key, returns success message', async () => {
        const travelTimeModel = new TravelTimeModel(validStartPoint, validEndPoint, validApiKey);
        const result = await travelTimeModel.getTravelTimes();

        expect(result).toHaveProperty('success', true);
        expect(result.data).toHaveProperty('historicalTravelTimeMinutes');
        expect(result.data).toHaveProperty('liveTrafficTravelTimeMinutes');
        expect(result.data).toHaveProperty('noTrafficTravelTimeMinutes');
        expect(result.data).toHaveProperty('travelDelayMinutes');

    });

    it('TC-11: Instantiate object with invalid startPoint and enPoint, returns failure message', async () => {

        const travelTimeModel = new TravelTimeModel(invalidStartPoint, invalidEndPoint, validApiKey);
        const result = await travelTimeModel.getTravelTimes();
        expect(result).toHaveProperty('success', false);

    });

    it('TC-11: Instantiate object with invalid apiKey, returns failure message', async () => {

        const travelTimeModel = new TravelTimeModel(validStartPoint, validEndPoint, invalidApiKey);
        const result = await travelTimeModel.getTravelTimes();
        expect(result).toHaveProperty('success', false);

    });
});
