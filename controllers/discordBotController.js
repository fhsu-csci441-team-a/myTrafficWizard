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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to handle form submission
app.post('/submit-form', (req, res) => {
    const { discordId, name } = req.body;

    // Send Discord ID and name to the bot
    sendToDiscordBot(discordId, name);

    res.send('Form submitted successfully');
});

// Logic to retrieve traffic and weather information
function retrieveInformation() {
    // Logic to retrieve traffic and weather information
    return {
      traffic: 'Traffic information',
      weather: 'Weather information'
    };
  }

// Discord bot event handling
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_API_TOKEN);



// Function to send traffic and weather info to user with given Discord ID
async function sendToDiscordBot(discordId, name) {
    try {
        const user = await client.users.fetch(discordId);
        if (user) {
            await user.send(`Hello ${name}! Here's your traffic and weather information:`);
            // Add logic here to retrieve and send traffic and weather info
            console.log(`Message sent to user with Discord ID ${discordId}`);
        } else {
            console.error(`User with Discord ID ${discordId} not found`);
        }
    } catch (error) {
        console.error(`Error sending message to user with Discord ID ${discordId}:`, error);
    }
}