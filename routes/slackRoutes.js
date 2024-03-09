// routes for Slack functions through slackBotController.js

// import express module for Express app and router for routes
const express = require('express');
const router = express.Router();

// import SlackBotController class file
const SlackBotController = require('../controllers/slackBotController');
// create new instance of class
const slackBotController = new SlackBotController();

// define GET routes for slack_bot html and js files
// binds created instance of SlackBotController so methods from created object
router.get('/slack_bot', slackBotController.serveFormHTML.bind(slackBotController));
router.get('/slack_bot.js', slackBotController.serveFormJS.bind(slackBotController));

// define POST route for sending message to Slack using object method
router.post('/postMessage', slackBotController.postMessage.bind(slackBotController));

// export router object, so routes can be used in other files
module.exports = router;