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
  }

  // serves the index.html home page in response to GET request
  serveIndex(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
  }

  // serves static files in the /static folder using middleware function
  serveStatic(req, res, next) {
    this.#staticPath(req, res, next);
  }

  async formSubmission(req, res) {
    // validate form data input
    // if all validations pass, submit form data to the database
    try {
        // create new model for each form submission
        this.#scheduledTripsObject = new ScheduledTripsModel();

        // create object with only trip data needed in database
        const tripData = {
          email_address: req.body.email_address,
          departure_latitude: req.body.departure_latitude,
          departure_longitude: req.body.departure_longitude,
          destination_latitude: req.body.destination_latitude,
          destination_longitude: req.body.destination_longitude,
          departure_date: new Date(req.body.departure_date),
          mobile_number: req.body.mobile_number,
          mobile_provider: req.body.mobile_provider,
          user_id_discord: req.body.user_id_discord,
          user_id_slack: req.body.user_id_slack,
          notification_status: null
        }

        // submit tripData to database
        const resultCreateTrip = await this.#scheduledTripsObject.createTrip(tripData);
        console.log(resultCreateTrip);
        res.json({ message: 'Trip #' + resultCreateTrip.data + " created!" });
        
        // const isAddressValid = await this.#inputValidationObject.checkAddress(req.body.address);
        // const isEmailValid = await this.#inputValidationObject.checkEmail(req.body.email);
        // const isPhoneValid = await this.#inputValidationObject.checkPhone(req.body.phone);
        // const isSlackIdValid = await this.#inputValidationObject.checkSlackId(req.body.slackId);
        // const isDiscordIdValid = await this.#inputValidationObject.checkDiscordId(req.body.discordId);

        // if (isAddressValid && isEmailValid && isPhoneValid 
        //   && isSlackIdValid && isDiscordIdValid) {
        //     // submit form data for trip to the database
        //     await this.#scheduledTripsObject.createTrip(req.body.body);
        // } else {
        //     // handle validation errors
        //     console.error('Form validation failed');
        // }
    } catch (error) {
        console.error('Error during form submission:', error);
        res.status(500).json({ message: 'There was an error processing your form.' });
    } finally {
      this.#scheduledTripsObject.close();
      console.log("Database connection closed.");
    }
  }
}

// export class so other modules can create HomeController objects
module.exports = HomeController;