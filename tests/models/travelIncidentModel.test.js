const TravelIncidentModel = require('../../models/travelIncidentModel');
require('dotenv').config();

describe('TC-12 TravelIncidentModel', () => {
    const validStartPoint = '37.3405,-97.6768';
    const validEndPoint = '38.0339,-96.9834';
    const validApiKey = process.env.TOMTOM_API_KEY;

    const invalidStartPoint = 'invalid_start';
    const invalidEndPoint = 'invalid_end';
    const invalidApiKey = 'invalid_api_key';

    it('TC-12: Instantiates object with valid startPoint, endPoint, and API key, returns success message', async () => {
        const travelIncidentModel = new TravelIncidentModel(validStartPoint, validEndPoint, validApiKey);
        const result = await travelIncidentModel.getTravelIncidents();

        expect(result).toHaveProperty('success', true);

        if (result.data) {
            expect(result.data[0]).toHaveProperty('iconCategory');
            expect(result.data[0]).toHaveProperty('magnitudeOfDelay');
            expect(result.data[0]).toHaveProperty('from');
            expect(result.data[0]).toHaveProperty('to');

        }


    });

    it('TC-12: Instantiate object with invalid startPoint and enPoint, returns failure message', async () => {

        const travelIncidentModel = new TravelIncidentModel(invalidStartPoint, invalidEndPoint, validApiKey);
        const result = await travelIncidentModel.getTravelIncidents();
        expect(result).toHaveProperty('success', false);

    });

    it('TC-12: Instantiate object with invalid apiKey, returns failure message', async () => {

        const travelIncidentModel = new TravelIncidentModel(validStartPoint, validEndPoint, invalidApiKey);
        const result = await travelIncidentModel.getTravelIncidents();
        expect(result).toHaveProperty('success', false);

    });
});
