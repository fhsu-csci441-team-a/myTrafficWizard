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
  async postMessage(req, res) {
    
    // uses the parameters passed in request body
    const userID = req.body.userID;
    const formattedMessage = req.body.formattedMessage;

    // try/catch to handle any errors
    try {
      // Use the postMessage function from DiscordBotModel to send the message to Discord
      const response = await this.#discordBotModel.postMessage(userID, formattedMessage);
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

// export DiscordBotController class to use in other files
module.exports = DiscordBotController;
