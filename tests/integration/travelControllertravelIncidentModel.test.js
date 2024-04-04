const TravelController = require('../../controllers/travelController');
require('dotenv').config();

describe('Integration Test: travelController=>travelIncidentModel', () => {
    let travelController;
    const apiKey = process.env.TOMTOM_API_KEY;
    const startPoint = '37.3405,-97.6768';
    const endPoint = '38.0339,-96.9834';


    it('travelController calls the travelIncidentModel for API data on travel time', async () => {

        travelController = new TravelController(startPoint, endPoint, apiKey);
        const result = await travelController.travelIncidentModel.getTravelIncidents();

        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('data');

        if (result.data) {
            const firstRowIndex = 0
            expect(result.data[firstRowIndex]).toHaveProperty('iconCategory');
            expect(result.data[firstRowIndex]).toHaveProperty('magnitudeOfDelay');
            expect(result.data[firstRowIndex]).toHaveProperty('from');
            expect(result.data[firstRowIndex]).toHaveProperty('to');

        }
    });



});