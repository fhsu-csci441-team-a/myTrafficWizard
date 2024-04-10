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

const client = new Client({ intents: myIntents});

// this class handles the request to send a message to Discord
class DiscordBotModel {

    // the postMessage method sends a message to Discord
    // makes use of passed parameters userID and formattedMessage
    async postMessage(userID, formattedMessage) {
    
      // Send the formatted message to the channel
      const response = await client.users.send(userID, formattedMessage);

      console.log(response);
    }
  }

// Discord bot event handling
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_API_TOKEN);

// export the DiscordBotModel class so other files can use it
module.exports = DiscordBotModel;