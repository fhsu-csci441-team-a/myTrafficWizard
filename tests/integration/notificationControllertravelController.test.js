/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const NotificationController = require('../../controllers/notificationController');
const TravelController = require('../../controllers/travelController');
const ScheduledTripsModel = require('../../models/scheduledTripsModel');
require('dotenv').config();

describe('Integration Test: notificationController=>travelController', () => {
    let notificationController;
    const apiKey = process.env.TOMTOM_API_KEY;
    const tripId = 3;
    const scheduledTripsModel = new ScheduledTripsModel('test_scheduled_trips');


    afterAll(async () => {
        await scheduledTripsModel.close();
    });

    it('notificationController calls the travelController to reach out to the traffic models for API data', async () => {

        const tripData = await scheduledTripsModel.getTripsById(tripId);


        notificationController = new NotificationController(tripData.data[0]);

        const travelData = await notificationController.fetchTravelData();
        console.log(travelData);

        expect(travelData).toHaveProperty('text');
        expect(travelData).toHaveProperty('html');
        expect(travelData.text).toContain('Your estimated travel time with live traffic');
        expect(travelData.html).toContain('Your estimated travel time with live traffic');
        expect(travelData.text).toContain('Your estimated travel time with live traffic');
        expect(travelData.html).toContain('Your estimated travel time with live traffic');


    });



});