// discordBotController responsible for controlling messages to Discord

// import path module to work with file/directory paths
const path = require('path');
// import the DiscordBotModel class 
const DiscordBotModel = require('../models/discordBotModel');

// this class controls sending messages to Discord
class DiscordBotController {

  // create private object attribute
  #discordBotModel;

  constructor() {
    // create a new DiscordBotModel object and assign to private attribute
    this.#discordBotModel = new DiscordBotModel();
  }

  // serves the discord_bot.html page
  serveFormHTML(req, res) {
    res.sendFile(path.join(__dirname, '../views/discord_bot.html'));
  }

  // serves the discord_bot.js file to process user input
  serveFormJS(req, res) {
    res.sendFile(path.join(__dirname, '../static/js/discord_bot.js'));
  }

  // sends a message to Discord
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
      // Use the postMessage function from DiscordBotModel to send the message to Discord
      const response = await this.#discordBotModel.postMessage(userID, formattedMessage);

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

// export DiscordBotController class to use in other files
module.exports = DiscordBotController;