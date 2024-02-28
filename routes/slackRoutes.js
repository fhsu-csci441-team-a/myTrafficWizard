// routes for Slack functions through slackBotController.js

const express = require('express');
const router = express.Router();
const SlackBotController = require('../controllers/slackBotController');
const slackBotController = new SlackBotController();

router.get('/slack_bot', slackBotController.index.bind(slackBotController));
router.get('/slack_bot.js', slackBotController.js.bind(slackBotController));
router.post('/postMessage', slackBotController.postMessage.bind(slackBotController));

module.exports = router;