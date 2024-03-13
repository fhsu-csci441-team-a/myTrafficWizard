// slackBotController responsible for controlling messages to Slack

// import path module to work with file/directory paths
const path = require('path');
// import the SlackBotModel class 
const SlackBotModel = require('../models/slackBotModel');

// this class controls sending messages to Slack
class SlackBotController {

  // create private object attribute
  #slackBotModel;

  constructor() {
    // create a new SlackBotModel object and assign to private attribute
    this.#slackBotModel = new SlackBotModel();
  }

  // serves the slack_bot.html page
  serveFormHTML(req, res) {
    res.sendFile(path.join(__dirname, '../views/slack_bot.html'));
  }

  // serves the slack_bot.js file to process user input
  serveFormJS(req, res) {
    res.sendFile(path.join(__dirname, '../static/js/slack_bot.js'));
  }

  // sends a message to Slack
  async postMessage(req, res) {
    
    // uses the parameters passed in request body
    const userID = req.body.userID;
    const formattedMessage = req.body.formattedMessage;

    // try/catch to handle any errors
    try {
      // Use the postMessage function from SlackBotModel to send the message to Slack
      const response = await this.#slackBotModel.postMessage(userID, formattedMessage);
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

// export SlackBotController class to use in other files
module.exports = SlackBotController;