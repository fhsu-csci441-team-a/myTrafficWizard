// slackBotController responsible for controlling messages to Slack

const path = require('path');
const SlackBotModel = require('../model/slackBotModel');

class SlackBotController {
  constructor() {
    this.slackBotModel = new SlackBotModel();
  }

  // serves the slack_bot.html page
  index(req, res) {
    res.sendFile(path.join(__dirname, '../views/slack_bot.html'));
  }

  // serves the slack_bot.js file to process user input
  js(req, res) {
    res.sendFile(path.join(__dirname, '../static/js/slack_bot.js'));
  }

  // send a message to Slack
  async postMessage(req, res) {
    const userID = req.body.userID;
    const formattedMessage = req.body.formattedMessage;

    try {
      // Use the postMessage function from SlackBotModel to send the message to Slack
      const response = await this.slackBotModel.postMessage(userID, formattedMessage);
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = SlackBotController;