// The app.js file contains the top-level routes */

const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch-npm');
const { exec } = require('child_process');

// finds current directory (local or hosted): __dirname or "."
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());

// Import individual route files
const homeRoutes = require('./routes/homeRoutes');
const addressRoutes = require('./routes/addressRoutes');
const testAddressModel = require('./tests/models/testAddressModel');
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
app.use(express.json());

// routes for testing NotificationController and message sending
app.post('/send_messages_test', (req, res) => {
  const tripId = req.body.tripId;
  exec(`node ./tests/controllers/testNotificationController.js ${tripId}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Failed to run test');
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.status(200).send('Test run successfully');
  });
});
app.get('/send_messages', (req, res) => {
  res.sendFile(path.join(__dirname, './tests/views/send_messages.html'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App is listening on port ' + (process.env.PORT || 3000));
});