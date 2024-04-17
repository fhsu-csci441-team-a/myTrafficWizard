// Originally written and debugged by Nicole-Rene Newcomb

// Processes postMessage requests to Slack
// Expected input parameter format:
// { "userID": "U12345678",
//  "formattedMessage": "Sample message!"}

// import node-fetch-npm to make HTTP/HTTPS requests
const fetch = require('node-fetch-npm');

// this class handles the request to send a message to Slack
class SlackBotModel {

  // the postMessage method sends a POST request to Slack
  // makes use of passed parameters userID and formattedMessage
  async postMessage(userID, formattedMessage) {
    
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${process.env.SLACK_API_TOKEN}`
      },
      body: JSON.stringify({
        channel: userID,
        text: `${formattedMessage}`
      })
    });

    const data = await response.json();
    console.log('Slack API response:', data);
    return data;
  }
}

// export the SlackBotModel class so other files can use it
module.exports = SlackBotModel;