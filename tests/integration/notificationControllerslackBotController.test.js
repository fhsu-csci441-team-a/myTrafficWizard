const NotificationController = require('../../controllers/notificationController');
require('dotenv').config();

describe('Integration Test: notificationController=>slackBotController', () => {
    const message = 'Hello, this is a message sent from: Integration Test: notificationController slackBotController.';
    const tripData = {
        email_address: 'test@test.com',
        departure_latitude: '38.872944508400714',
        departure_longitude: '-99.34445344258867',
        destination_latitude: '38.895660556826314',
        destination_longitude: '-99.31664430129287',
        departure_date: new Date(),
        mobile_number: '555-555-2000',
        mobile_provider: 'tmomail.net',
        user_id_discord: null,
        user_id_slack: 'U06HSLMJGG3',
        notification_status: null
    }


    it('notificationController calls the slackBotController to send a notification via the Slack channel.', async () => {
        const notificationController = new NotificationController(tripData);
        notificationController.createSlackObject();
        const result = await notificationController.postSlackMessage(tripData.user_id_slack, message);

        expect(result).toHaveProperty('ok', true);
        expect(result.message).toHaveProperty('text', message);


    });



});