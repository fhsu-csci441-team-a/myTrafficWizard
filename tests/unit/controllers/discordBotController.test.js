/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const DiscordBotController = require('../../../controllers/discordBotController');
require('dotenv').config();



describe('TC-18: DiscordBotController', () => {

    const validMessage = 'Hello, this is a test for a properly formatted message.';
    const invalidMessage = undefined;
    const validUserId = '1063659423832232086';
    const invalidUserId = '';
    const discordBotController = new DiscordBotController();


    it('TC-17: A valid formattedMessage and userId are provided; response indicates message delivery to user', async () => {
        const result = await discordBotController.postMessage(validUserId, validMessage);

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('createdTimestamp');
        expect(result).toHaveProperty('type', 0);
        expect(result).toHaveProperty('content', validMessage);


    });


    it('TC-17: An invalid formattedMessage and userId are provided; response indicates an error occurred', async () => {
        const result = await discordBotController.postMessage(invalidUserId, invalidMessage);

        expect(result).toHaveProperty('code', 500);
        expect(result).toHaveProperty('message');
        expect(result.message).toContain('Discord Bot Model Failed');

    });

});