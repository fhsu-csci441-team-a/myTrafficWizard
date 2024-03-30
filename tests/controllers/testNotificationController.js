const path = require('path');
const NotificationController = require('../controllers/notificationController');
const ScheduledTripsModel = require('../models/scheduledTripsModel');

async function test() {
  // Retrieve a trip from database
  const scheduledTripsObject = new ScheduledTripsModel();
  const tripObject = await scheduledTripsObject.getTripsById(16);
  const tripData = tripObject.data[0];

  // Create a new NotificationController
  const notificationController = new NotificationController(tripData);

  // Call the sendMessage method
  await notificationController.sendMessage()
    .then(() => {
      console.log('sendMessage method completed successfully');
    })
    .catch((error) => {
      console.error('sendMessage method failed with error:', error);
    });
}

test();