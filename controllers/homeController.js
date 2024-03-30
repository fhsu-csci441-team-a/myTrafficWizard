// homeController.js file is the controller for the home/index page
// displays index.html from views and is starting place of user input/interaction
// calls scheduledTripsModel to submit user-entered trip/user/channel data to table

// import path module to work with file/directory paths
const path = require('path');

// import files for other classes
// const InputValidation = require('./InputValidation');
const ScheduledTripsModel = require('../models/scheduledTripsModel');

// import express module for Express app
const express = require('express');

// this class handles home page requests
class HomeController {

  // declare private class attribute
  #staticPath;
  // #inputValidationObject;
  #scheduledTripsObject;

  constructor() {
    // assigns middleware function to attribute for serving static files
    // initial set up process makes it more efficient to create attribute
    this.#staticPath = express.static(path.join(__dirname, '../static'));
    
    // create InputValidation and ScheduledTripsModel objects
    // this.#inputValidationObject = new InputValidation();
    this.#scheduledTripsObject = new ScheduledTripsModel();
  }

  // serves the index.html home page in response to GET request
  serveIndex(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
  }

  // serves static files in the /static folder using middleware function
  serveStatic(req, res, next) {
    this.#staticPath(req, res, next);
  }

  async formSubmission(formSubmissionObject) {
    // validate form data input
    // if all validations pass, submit form data to the database
    try {
        console.log(formSubmissionObject);
        // const isAddressValid = await this.#inputValidationObject.checkAddress(formSubmissionObject.address);
        // const isEmailValid = await this.#inputValidationObject.checkEmail(formSubmissionObject.email);
        // const isPhoneValid = await this.#inputValidationObject.checkPhone(formSubmissionObject.phone);
        // const isSlackIdValid = await this.#inputValidationObject.checkSlackId(formSubmissionObject.slackId);
        // const isDiscordIdValid = await this.#inputValidationObject.checkDiscordId(formSubmissionObject.discordId);

        // if (isAddressValid && isEmailValid && isPhoneValid 
        //   && isSlackIdValid && isDiscordIdValid) {
        //     // submit form data for trip to the database
        //     await this.#scheduledTripsObject.createTrip(formSubmissionObject);
        // } else {
        //     // handle validation errors
        //     console.error('Form validation failed');
        // }
    } catch (error) {
        console.error('Error during form submission:', error);
    }
  }
}

// export class so other modules can create HomeController objects
module.exports = HomeController;