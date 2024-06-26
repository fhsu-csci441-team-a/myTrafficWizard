/*
* written by: Nicole-Rene Newcomb
* tested by: Team
* debugged by: Team
*/

/* testNotificationController.js tests the sending of messages
      It allows for the manual triggering of the message sending process
      In the final product, this role is filled by the scheduleController
*/

const path = require('path');
const NotificationController = require('../controllers/notificationController');
const ScheduledTripsModel = require('../models/scheduledTripsModel');

// tests creation of NotificationController object and message sending
async function test(tripId) {
  try {
    // Retrieve a trip from database
    const scheduledTripsObject = new ScheduledTripsModel();
    const tripObject = await scheduledTripsObject.getTripsById(tripId);
    const tripData = tripObject.data[0];

    // Create a new NotificationController
    const notificationController = new NotificationController(tripData);

    // Call the sendMessage method
    await notificationController.sendMessage();

    // Close the database connection
    scheduledTripsObject.close();

    console.log('Messages for TripId ' + tripId + ' sent!');
    return 'Messages for TripId ' + tripId + ' sent!';
  } catch (error) {
    console.error('Message Sending for tripId ' + tripId + ' failed with error: ', error);
    return 'Message Sending for tripId ' + tripId + ' failed with error: ' + error.message;
  }
}

// Get tripId from command line arguments
console.log(process.argv[2]);
const tripId = process.argv[2];
test(tripId);