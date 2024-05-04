/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const SlackBotController = require('../../../controllers/slackBotController');
require('dotenv').config();



describe('TC-17: slackBotController', () => {

    const validMessage = 'Hello, this is a test for a properly formatted message.';
    const invalidMessage = undefined;
    const validUserId = 'U06HSLMJGG3';
    const invalidUserId = '';
    const slackBotController = new SlackBotController();

    it('TC-17: A valid formattedMessage and userId are provided; response indicates message delivery to user', async () => {
        const result = await slackBotController.postMessage(validUserId, validMessage);

        expect(result).toHaveProperty('ok', true);
        expect(result.message).toHaveProperty('text', validMessage);
    });


    it('TC-17: An invalid formattedMessage and userId are provided; response indicates an error occurred', async () => {
        const result = await slackBotController.postMessage(invalidUserId, invalidMessage);

        expect(result).toHaveProperty('ok', false);
        expect(result).toHaveProperty('error');
    });

});