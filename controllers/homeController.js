// homeController.js file is the controller for the home/index page
// displays index.html from views and is starting place of user input/interaction
// upon submission, sends user data to notificationController.js
// uses addressModel.js for address completion
// includes address autocomplete functionality

const path = require('path');
const express = require('express');

// serves the index.html home page
exports.index = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
};

// serves the static files
exports.static = express.static(path.join(__dirname, '../static'));