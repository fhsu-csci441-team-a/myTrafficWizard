// Routes for Discord Bot and page to test sending of messages
const express = require('express');
const router = express.Router();

const DiscordBotController = require('../controllers/discordBotController');
const discordBotController = new DiscordBotController();

// Define GET routes for serving HTML and JS files
router.get('/discord_bot', discordBotController.serveFormHTML.bind(discordBotController));
router.get('/discord_bot.js', discordBotController.serveFormJS.bind(discordBotController));

// Define POST route for sending message to Discord using object method
router.post('/postMessage', discordBotController.postMessage.bind(discordBotController));

// Export router object
module.exports = router;