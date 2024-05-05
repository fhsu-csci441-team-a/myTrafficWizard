/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const NotificationController = require('../../controllers/notificationController');
require('dotenv').config();



describe('Integration Test: notificationController=>discordBotController', () => {


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
            user_id_discord: '1063659423832232086',
            user_id_slack: null,
            notification_status: null
        };

        const message = 'test integration';

        const notificationController = new NotificationController(tripData);
        notificationController.createDiscordObject();
        const result = await notificationController.postDiscordMessage(tripData.user_id_discord, message);

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('createdTimestamp');
        expect(result).toHaveProperty('type', 0);
        expect(result).toHaveProperty('content', message);


    }, 20000);



});