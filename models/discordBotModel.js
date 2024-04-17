// Originally written by Jacob Spalding
// Updated and debugged by Nicole-Rene Newcomb

// Processes postMessage requests to Discord
// Expected input parameter format:
// { "userID": "123456789012345678",
//   "formattedMessage": "Sample message!" }

// install/import discord.js library to interact with Discord API
const { Client, IntentsBitField } = require('discord.js');

// this class handles the request to send a message to Discord
class DiscordBotModel {

  #client;

  // creates new client connection to Discord Bot
  constructor() {
    // set intents (permissions) for Discord bot
    const myIntents = new IntentsBitField();
    myIntents.add(
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildPresences, 
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
      IntentsBitField.Flags.DirectMessages
    );

    // create client to create connection to Discord
    this.#client = new Client({ intents: myIntents });

    // Discord Bot event handler/listener function
    this.readyPromise = new Promise(resolve => {
      this.#client.on('ready', () => {
        console.log(`Logged in as ${this.#client.user.tag}`);
        resolve();
      });
    });
  }

  // public method to login to Discord Bot client with API token
  async login() {
    try {
      await this.#client.login(process.env.DISCORD_API_TOKEN);
      await this.readyPromise;
      return { code:200, message: `Discord client login successful`}
    }
    catch (error) {
      console.error("Login failed:", error);
      return { code: 500, message: `Discord Bot Model Login Failed:\n ${error}` };
    }
  }

  // public method to disconnect/destroy Discord client connection
  async destroy() {
    try {
      // disconnect/destroy the client connection
      await this.#client.destroy();
      console.log("The Discord client has been disconnected")
      return { code:200, message: `Discord client destroyed successfully`}
    }
    catch (error) {
      console.error("Error while destroying Discord connection:", error);
    }
  }

  // the postMessage method sends a message to Discord
  async postMessage(userID, formattedMessage) {
    try {
      // send the formatted message to Discord through the client
      const response = await this.#client.users.send(userID, formattedMessage);
      console.log(response);
      return response;
    } 
    catch (error) {
      return { code: 500, message: `Discord Bot Model Failed:\n ${error}` };
    }
  }
}

module.exports = DiscordBotModel;