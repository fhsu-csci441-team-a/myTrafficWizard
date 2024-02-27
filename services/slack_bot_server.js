// Processes postMessage requests
// Expected input parameter format:
// { "slackId": "C12345678",
//  "name": "Sample message!"}

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch-npm');

exports.postMessage = async (slackId, message) => {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${process.env.SLACK_API_TOKEN}`
    },
    body: JSON.stringify({
      channel: slackId,
      text: `${message}`
    })
  });

  const data = await response.json();
  return data;
};