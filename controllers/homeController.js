// homeController.js file is the controller for the home/index page
// displays index.html from views and is starting place of user input/interaction
// calls scheduledTripsModel to submit user-entered trip/user/channel data to table

// import path module to work with file/directory paths
const path = require('path');

// import express module for Express app
const express = require('express');

// this class handles home page requests
class HomeController {

  // declare private class attribute
  #staticPath;

  constructor() {
    // assigns middleware function to attribute for serving static files
    // initial set up process makes it more efficient to create attribute
    this.#staticPath = express.static(path.join(__dirname, '../static'));
  }

  // serves the index.html home page in response to GET request
  serveIndex(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
  }

  // serves static files in the /static folder using middleware function
  serveStatic(req, res, next) {
    this.#staticPath(req, res, next);
  }
}

// export class so other modules can create HomeController objects
module.exports = HomeController;