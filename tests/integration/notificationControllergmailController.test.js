const NotificationController = require('../../controllers/notificationController');
require('dotenv').config();

describe('Integration Test: notificationController=>gmailController', () => {
    const travelData = { "text": "Test Travel Data", "html": "<p>Test Travel Data</p>" };
    const weatherData = { "text": "Test Weather Data", "html": "<p>Test Weather Data</p>" };
    const tripData = {
        email_address: 'test@test.com',
        departure_latitude: '38.872944508400714',
        departure_longitude: '-99.34445344258867',
        destination_latitude: '38.895660556826314',
        destination_longitude: '-99.31664430129287',
        departure_date: new Date(),
        mobile_number: '555-555-2000',
        mobile_provider: 'tmomail.net',
        user_id_discord: 'JohnTestDiscord',
        user_id_slack: 'JohnTestSlack',
        notification_status: null
    }


    it('notificationController calls the gmailController to send a notification via the gmail channel.', async () => {
        const notificationController = new NotificationController(tripData);

        notificationController.createMessageObject(travelData, weatherData);
        const message = notificationController.getMessageObject(travelData, weatherData);

        notificationController.createGmailObject(tripData.email_address, message);
        const response = await notificationController.sendGMail();

        expect(response.accepted).toContain(tripData.email_address);
        expect(response.rejected).toHaveLength(0);
        expect(response.messageId).toBeTruthy();
        expect(response.response).toContain('250 2.0.0 OK');


    });



});