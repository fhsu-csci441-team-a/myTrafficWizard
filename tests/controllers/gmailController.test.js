const nodemailer = require('nodemailer');
const GmailController = require('../../controllers/gmailController');
const MessageModel = require('../../models/messageModel');

j

describe('TC-16 GmailController', () => {
    const validRecipient = 'test@example.com';
    const invalidRecipient = 'not-an-email';

    const message = new MessageModel();
    message.getTextMessage = jest.fn().mockReturnValue('Test text message');
    message.getHTMLMessage = jest.fn().mockReturnValue('<p>Test HTML message</p>');


    it('TC-16: User provides an invalid email adddress; the messsage does not arrive in their email inbox', async () => {
        const gmailController = new GmailController(invalidRecipient, message);
        await gmailController.sendGMail();
        await expect(gmailController.sendEmail(invalidEmail, message)).rejects.toThrow('Invalid email address');

    });

    it('TC-16: User provides a valid email address; the message arrives in their email box', async () => {
        const gmailController = new GmailController(validRecipient, message);
        const result = await gmailController.sendGMail();
        expect(result).toHaveProperty('success', true);
        expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();

    });


});