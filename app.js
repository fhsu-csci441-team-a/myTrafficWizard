// The app.js file contains the top-level routes */

const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch-npm');
const { spawn } = require('child_process');

// finds current directory (local or hosted): __dirname or "."
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());

// Import individual route files
const homeRoutes = require('./routes/homeRoutes');
const addressRoutes = require('./routes/addressRoutes');
const testAddressModel = require('./tests/testAddressModel');
const gmailRoutes = require('./routes/gmailRoutes');
const slackRoutes = require('./routes/slackRoutes');
const discordRoutes = require('./routes/discordRoutes');

// Use route files based on relative path
app.use('/', homeRoutes);
app.use('/address', addressRoutes);
app.use('/testaddress', testAddressModel);
app.use('/gmail', gmailRoutes);
app.use('/slack', slackRoutes);
app.use('/discord', discordRoutes);

// routes for testing NotificationController and message sending
app.post('/send_messages_test', (req, res) => {
  console.log("Post request received.")
  const tripId = req.body.tripId;
  const test = spawn('node', [`./tests/testNotificationController.js`, tripId]);
  test.stdin.end();

  let responseSent = false;

  function sendResponse(status, message, error) {
    if (!responseSent) {
      responseSent = true;
      res.status(status).json({ message: message, error: error });
    }
  }

  test.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    if (data.includes('Messages for TripId')) {
      const message = data.toString().split('\n').find(line => line.includes('Messages for TripId'));
      sendResponse(200, message);
    }
  });

  test.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    if (data.includes('Message Sending for tripId')) {
      sendResponse(500, data.toString().trim());
    }
  });

  test.on('error', (error) => {
    console.error(`spawn error: ${error}`);
    sendResponse(500, 'Failed to run test', error.message);
  });

  test.on('exit', (code, signal) => {
    console.log(`child process exited with code ${code} and signal ${signal}`);
  });

  test.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
  });

  test.on('disconnect', () => {
    console.log('Child process disconnected');
  });
});

// endoint to send messages to selected channels
app.get('/send_messages', (req, res) => {
  res.sendFile(path.join(__dirname, './tests/send_messages.html'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App is listening on port ' + (process.env.PORT || 3000));
});