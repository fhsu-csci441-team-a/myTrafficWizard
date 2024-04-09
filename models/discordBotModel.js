// Processes postMessage requests to Discord
// Expected input parameter format:
// { "userID": "123456789012345678",
//   "formattedMessage": "Sample message!" }

// import discord.js library to interact with Discord API
const { Client, IntentsBitField } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const app = express();
const PORT = 3000;
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
    ],
});

// this class handles the request to send a message to Discord
class DiscordBotModel {

    // the postMessage method sends a message to Discord
    // makes use of passed parameters userID and formattedMessage
    async postMessage(userID, formattedMessage) {
      // Initialize a Discord client
      const client = new Client();
      
      // Login to Discord with the provided bot token
      await client.login(process.env.DISCORD_API_TOKEN);
  
      // Fetch the channel object using the userID
      const channel = await client.channels.fetch(userID);
  
      // Send the formatted message to the channel
      await channel.send(formattedMessage);
  
      // Logout the client after sending the message
      await client.destroy();
    }
  }

// Discord bot event handling
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_API_TOKEN);

// export the DiscordBotModel class so other files can use it
module.exports = DiscordBotModel;