// routes for Slack functions through slackBotController.js

const express = require('express');
const router = express.Router();
const slackBotController = require('../controllers/slackBotController');

router.get('/slack_bot', slackBotController.index);
router.get('/slack_bot.js', slackBotController.js);
router.use('/postMessage', slackBotController.postMessage);

module.exports = router;