require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/slack_bot', (req, res) => {
  res.sendFile(path.join(__dirname, 'slack_bot.html'));
});

app.get('/slack_bot.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'slack_bot.js'));
});

app.get('/postMessage', async (req, res) => {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${process.env.SLACK_API_TOKEN}`
    },
    body: JSON.stringify({
      channel: 'U06HQP5JN1X',
      text: 'Hello, world!'
    })
  });

  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => {
  console.log('App is listening on port 3000');
});