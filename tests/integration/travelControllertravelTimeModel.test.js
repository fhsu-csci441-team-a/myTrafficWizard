/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const TravelController = require('../../controllers/travelController');
require('dotenv').config();

describe('Integration Test: travelController=>travelTimeModel', () => {
    let travelController;
    const apiKey = process.env.TOMTOM_API_KEY;
    const startPoint = '37.3405,-97.6768';
    const endPoint = '38.0339,-96.9834';




    it('travelController calls the travelTimeModel for API data on travel time', async () => {

        travelController = new TravelController(startPoint, endPoint, apiKey);
        const result = await travelController.travelTimeModel.getTravelTimes();


        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('data');
        expect(result.data).toHaveProperty('historicalTravelTimeMinutes');
        expect(result.data).toHaveProperty('liveTrafficTravelTimeMinutes');
        expect(result.data).toHaveProperty('noTrafficTravelTimeMinutes');
        expect(result.data).toHaveProperty('travelDelayMinutes');
    });



});