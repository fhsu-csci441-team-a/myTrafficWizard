// homeController.js file is the controller for the home/index page
// displays index.html from views and is starting place of user input/interaction
// calls scheduledTripsModel to submit user-entered trip/user/channel data to table

const path = require('path');
const express = require('express');

class HomeController {
  constructor() {
    this.staticPath = express.static(path.join(__dirname, '../static'));
  }

  // serves the index.html home page
  index(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
  }

  // serves the static files
  static(req, res, next) {
    this.staticPath(req, res, next);
  }
}

module.exports = HomeController;