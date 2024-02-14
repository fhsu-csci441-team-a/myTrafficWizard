// routes for Slack functions through slackController.js

const path = require('path');
const slackBotRouter = require('../models/slack_bot_server');

// serves the slack_bot.html page
exports.index = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/slack_bot.html'));
};

// serves the slack_bot.js file to process user input
exports.js = (req, res) => {
  res.sendFile(path.join(__dirname, '../static/js/slack_bot.js'));
};

exports.postMessage = slackBotRouter;