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

  // creates new connection to Discord Bot each time instantiated
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

    this.#initiateDiscordBot(myIntents);
  }

  // implements await functions used during DiscordBotModel creation
  async #initiateDiscordBot(myIntents) {
    // create client to create connection to Discord
    this.#client = new Client({ intents: myIntents });
    await this.#client.login(process.env.DISCORD_API_TOKEN);

    // Discord Bot event handler function
    const readyFunction = () => {
      console.log(`Logged in as ${this.#client.user.tag}`);
    };

    // creating Discord Bot event listener
    await this.#client.on('ready', readyFunction);
  }

  // public method to close Discord client connection
  async closeConnection() {
    // wait for the client to become ready before destroying it
    await new Promise(resolve => {
      this.#client.once('ready', () => resolve());
    });

    // Destroy the client connection (after being ready)
    await this.#client.destroy();
  }

  // the postMessage method sends a message to Discord
  async postMessage(userID, formattedMessage) {
    try {
      // Send the formatted message to Discord through the client
      const response = await this.#client.users.send(userID, formattedMessage);
      console.log(response);
      return response;

    } catch (error) {
      return { code: 500, message: 'Discord Bot Model Failed' };

    } finally {
        try {
          await this.closeConnection();
          console.log("The Discord connection has been disconnected");
          
        } catch (error) {
          console.error("Error while destroying Discord connection:", error);
        }
    }
  }
}

module.exports = DiscordBotModel;