// Originally written by Jacob Spalding
// Updated and debugged by Nicole-Rene Newcomb

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
    // create the private attribute DiscordBotModel
    this.#discordBotModel;
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
      // create new discordBotModel object and login
      this.#discordBotModel = new DiscordBotModel();
      const login = await this.#discordBotModel.login();
      console.log(login);

      // use DiscordBotModel's postMessage() to send the message to Discord
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
      // if (req, res) were passed, send the error message
      if (typeof args[0] === 'object' && args[0].body) {
        args[1].status(500).send(err.message);
      }
      // otherwise, throw the error
      else {
        throw err;
      }
    } finally {
      // destroy the Discord client connection to disconnect
      const destroy = await this.#discordBotModel.destroy();
      console.log(destroy);
    }
  }
}

// export DiscordBotController class to use in other files
module.exports = DiscordBotController;