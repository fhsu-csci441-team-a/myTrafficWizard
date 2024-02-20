const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch-npm');

// finds current directory (local or hosted): __dirname or "."
app.use(express.static('__dirname'));
app.use(express.json()); 

// Import individual route files
const homeRoutes = require('./routes/homeRoutes');
const gmailRoutes = require('./routes/gmailRoutes');
const slackRoutes = require('./routes/slackRoutes');
const discordRoutes = require('./routes/discordRoutes');

// Use route files based on relative path
app.use('/', homeRoutes);
app.use('/gmail', gmailRoutes);
app.use('/slack', slackRoutes);
app.use('/discord', discordRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log('App is listening on port ' + (process.env.PORT || 3000));
});