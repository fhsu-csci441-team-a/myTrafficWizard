/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const NotificationController = require('../../controllers/notificationController');
require('dotenv').config();


describe('Integration Test: notificationController=>weatherController', () => {


    it('notificationController calls the weatherController to reach out to the weatherModel for API data', async () => {


        const tripData = {
            trip_id: 700000,
            email_address: 'tbanderson@mail.fhsu.edu',
            departure_latitude: '40.712776',
            departure_longitude: '-74.006000',
            destination_latitude: '40.712776',
            destination_longitude: '-74.005974',
            departure_date: new Date(),
            mobile_number: null,
            mobile_provider: null,
            user_id_discord: null,
            user_id_slack: null,
            notification_status: null
        };

        const notificationController = new NotificationController(tripData);
        const result = await notificationController.fetchWeatherData();
        console.log(result);

        expect(result).toHaveProperty("text");
        expect(result).toHaveProperty("html");


    }, 20000);



});