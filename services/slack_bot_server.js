// Processes postMessage requests to Slack
// Expected input parameter format:
// { "userId": "U12345678",
//  "formattedMessage": "Sample message!"}

const fetch = require('node-fetch-npm');

class SlackBotModel {
  async postMessage(userId, formattedMessage) {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${process.env.SLACK_API_TOKEN}`
      },
      body: JSON.stringify({
        channel: userId,
        text: `${formattedMessage}`
      })
    });

    const data = await response.json();
    return data;
  }
}

module.exports = SlackBotModel;