const express = require('express');
const fetch = require('node-fetch-npm');
const router = express.Router();

router.post('/', async (req, res) => {
  const { slackId, name } = req.body;

  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${process.env.SLACK_API_TOKEN}`
    },
    body: JSON.stringify({
      channel: slackId,
      text: `Hello, ${name}!`
    })
  });

  const data = await response.json();
  res.json(data);
});

module.exports = router;