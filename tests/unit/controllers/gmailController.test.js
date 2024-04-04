const GmailController = require('../../../controllers/gmailController');
const MessageModel = require('../../../models/messageModel');



describe('TC-16 GmailController', () => {
    const validRecipient = 'tbanderson@mail.fhsu.edu';
    const invalidRecipient = 'not-an-email@@notemail.com';
    const travelData = { "text": 'Test text message travel', 'html': '<p>Test HTML message travel</p>' };
    const weatherData = { "text": 'Test text message weather', 'html': '<p>Test HTML message weather</p>' };


    const message = new MessageModel(travelData, weatherData);


    it('TC-16: User provides an invalid email adddress; the messsage does not arrive in their email inbox', async () => {
        const gmailController = new GmailController(invalidRecipient, message);
        const response = await gmailController.sendGMail();
        console.log(response);

        expect(response).toHaveProperty('error');
    });



    it('TC-16: User provides a valid email address; the message arrives in their email box', async () => {
        const gmailController = new GmailController(validRecipient, message);
        const response = await gmailController.sendGMail();

        expect(response.accepted).toContain(validRecipient);
        expect(response.rejected).toHaveLength(0);
        expect(response.messageId).toBeTruthy();
        expect(response.response).toContain('250 2.0.0 OK');

    });


});