// routes for Discord functions through discordBotController.js

const express = require('express');
const router = express.Router();
const discordBotController = require('../controllers/discordBotController');

router.post('/send', discordBotController.sendMessage);

module.exports = router;