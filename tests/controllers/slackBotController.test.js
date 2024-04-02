const SlackBotController = require('./slackBotController');

// send Slack message if slack ID provided
if (this.#tripData.user_id_slack) {
    console.log('Attempting to send Slack message to user:', this.#tripData.user_id_slack);
    try {
        await this.#slackBotControllerObject.postMessage(
            this.#tripData.user_id_slack, plainTextMessage);
        console.log('Slack message sent successfully');
    } catch (error) {
        console.error('Failed to send Slack message:', error);
    }
}


describe('TC-17: slackBotController', () => {

    const formattedMessage = 'Hello, this is a test for a properly formatted message.';
    const validUserId = 'U06HSLMJGG3';
    const invalidUserId = '';
    const slackBot = new SlackBotController();

    it('TC-17: A valid formattedMessage and userId are provided', async () => {
        const result = await slackBot.postMessage(validUserId, formattedMessage);
        console.log(result)

        expect(result).toHaveProperty('success');
    });






});