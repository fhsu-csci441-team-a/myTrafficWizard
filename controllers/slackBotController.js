// Originally written and debugged by Nicole-Rene Newcomb

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
  async postMessage(...args) {

    var userID, formattedMessage;

    // if first argument is object, assume (req, res)
    if (typeof args[0] === 'object' && args[0].body) {
        userID = args[0].body.userID;
        formattedMessage = args[0].body.formattedMessage;
    }

    // elif first argument has no body, assume (userID, formattedMessage)
    else if (args.length === 2) {
        userID = args[0];
        formattedMessage = args[1];
    }

    // otherwise, throw an error
    else {
        throw new Error('Invalid arguments');
    }

    // try/catch to handle any errors
    try {
      // use postMessage to send the message to Slack
      const response = await this.#slackBotModel.postMessage(userID, formattedMessage);

      // if (req, res) were passed, send the response
      if (typeof args[0] === 'object' && args[0].body) {
        args[1].status(200).send(response);
      }
      // otherwise, return the response
      else {
        return response;
      }
    } catch (err) {
      // If (req, res) were passed, send the error message
      if (typeof args[0] === 'object' && args[0].body) {
        args[1].status(500).send(err.message);
      }
      // Otherwise, throw the error
      else {
        throw err;
      }
    }
  }
}

// export SlackBotController class to use in other files
module.exports = SlackBotController;