// Processes postMessage requests to Discord
// Expected input parameter format:
// { "userID": "123456789012345678",
//   "formattedMessage": "Sample message!" }

// import discord.js library to interact with Discord API
const { Client, IntentsBitField } = require('discord.js');

// set intents (permissions) for Discord bot
const myIntents = new IntentsBitField();
myIntents.add(
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildPresences, 
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
  IntentsBitField.Flags.DirectMessages);

// this class handles the request to send a message to Discord
class DiscordBotModel {

  #client;

  // creates new connection to Discord Bot each time instantiated
  constructor() {
    this.#client = new Client({ intents: myIntents });
    this.#client.login(process.env.DISCORD_API_TOKEN);

    // Discord bot event handling
    const readyFunction = () => {
      console.log(`Logged in as ${this.#client.user.tag}`);
    };
    this.#client.on('ready', readyFunction);
  }

  // the postMessage method sends a message to Discord
  // makes use of passed parameters userID and formattedMessage
  async postMessage(userID, formattedMessage) {
  
    try {

      // Send the formatted message to the channel
      const response = await this.#client.users.send(userID, formattedMessage);

      // log the response
      console.log(response);

      // return response
      return response;
      console.log("testing return after");
    } catch (error) {
      return { code: 500, message: 'Discord Bot Model Failed' };
    } finally {
      try {
        // Wait for the client to become ready before destroying it
        await new Promise(resolve => {
          this.#client.once('ready', () => resolve());
        });

        // Destroy the client connection (after being ready)
        this.#client.destroy();
        console.log("The Discord connection has been destroyed.")
      } catch (error) {
        console.error("Error while destroying Discord connection:", error);
      }
    }
  }
}

// export the DiscordBotModel class so other files can use it
module.exports = DiscordBotModel;