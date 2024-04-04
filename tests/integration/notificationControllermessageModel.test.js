const NotificationController = require('../../controllers/notificationController');
require('dotenv').config();

describe('Integration Test: notificationController=>messageModel', () => {
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
    const notificationController = new NotificationController(tripData);


    it('notificationController calls the messageModel to properly format a message based on the data', async () => {

        notificationController.createMessageObject(travelData, weatherData);
        const messageModel = notificationController.getMessageObject(travelData, weatherData);
        const plainTextMessage = messageModel.getTextMessage();
        const htmlMessage = messageModel.getHTMLMessage();

        expect(plainTextMessage).toContain(travelData.text);
        expect(plainTextMessage).toContain(weatherData.text);
        expect(plainTextMessage).toContain('This is a notification message from myTrafficWizard.');
        expect(htmlMessage).toContain(travelData.html);
        expect(htmlMessage).toContain(weatherData.html);
        expect(htmlMessage).toContain('<h1>This is an notification message from myTrafficWizard.</h1>');



    });



});