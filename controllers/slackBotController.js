// slackBotController responsible for controlling messages to Slack

const path = require('path');
const slackBotRouter = require('../services/slack_bot_server');

// serves the slack_bot.html page
exports.index = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/slack_bot.html'));
};

// serves the slack_bot.js file to process user input
exports.js = (req, res) => {
  res.sendFile(path.join(__dirname, '../static/js/slack_bot.js'));
};

// send a message to Slack
exports.postMessage = (req, res) => {
  const slackId = req.body.slackId;
  const message = req.body.message;

  // Use the slackBotRouter to send the message to Slack
  slackBotRouter.postMessage(slackId, message)
    .then(response => res.status(200).send(response))
    .catch(err => res.status(500).send(err.message));
};