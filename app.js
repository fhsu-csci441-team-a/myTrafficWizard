require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch-npm');
const app = express();
const slackBotRouter = require('./slack_bot_server');

// finds current directory (local or hosted): __dirname or "."
app.use(express.static('__dirname'));
app.use(express.json()); 

// route of home page directs to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// route of slack_bot directs to slack_bot.html
app.get('/slack_bot', (req, res) => {
  res.sendFile(path.join(__dirname, 'slack_bot.html'));
});

app.get('/slack_bot.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'slack_bot.js'));
});

app.use('/postMessage', slackBotRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log('App is listening on port ' + (process.env.PORT || 3000));
});