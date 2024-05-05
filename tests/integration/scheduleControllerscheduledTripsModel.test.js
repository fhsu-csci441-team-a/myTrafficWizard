/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const ScheduleController = require('../../controllers/scheduleController');
const ScheduledTripsModel = require('../../models/scheduledTripsModel');

require('dotenv').config();

describe('Integration Test: scheduleController=>scheduledTripsModel', () => {
    let scheduleController;
    let scheduledTripsModel;
    let table = 'test_scheduled_trips';
    let scheduledIntervalMinutes = 15;
    let testDate = new Date()
    const tripData = {
        email_address: 'tbanderson@mail.fhsu.edu',
        departure_latitude: '40.712776',
        departure_longitude: '-74.005974',
        destination_latitude: '34.052235',
        destination_longitude: '-118.243683',
        departure_date: new Date(testDate.getTime() + 10 * 60000),
        mobile_number: '555-555-5555',
        mobile_provider: 'AT&T',
        user_id_discord: 'test123',
        user_id_slack: 'test123',
        notification_status: null
    };



    it('scheduleController calls scheduledTripsModel to find upcoming scheduled trips in the database', async () => {


        scheduledTripsModel = new ScheduledTripsModel(table);
        scheduleController = new ScheduleController(scheduledIntervalMinutes, 1, 300, scheduledTripsModel);


        await scheduledTripsModel.createTrip(tripData);
        let currentDateTime = scheduleController.getCurrentDateTime();
        let tripQueue = await scheduleController.getUpcomingTrips(true);

        let queryResults = await scheduledTripsModel.getUpcomingTrips(currentDateTime, scheduledIntervalMinutes);


        const countScheduleController = tripQueue.length;
        const countQueryResults = queryResults.data.length;

        await scheduledTripsModel.close();

        expect(countScheduleController).toEqual(countQueryResults);


    });



});