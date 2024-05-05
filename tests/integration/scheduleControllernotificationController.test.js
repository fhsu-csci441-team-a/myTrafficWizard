/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const ScheduleController = require('../../controllers/scheduleController');
const NotificationController = require('../../controllers/notificationController');
const ScheduledTripsModel = require('../../models/scheduledTripsModel');
require('dotenv').config();



describe('Integration Test: scheduleController=>notificationController', () => {


    it('scheduleController calls the notificationController when a scheduled notification is present', async () => {

        const scheduleController = new ScheduleController();
        const scheduledTripsModel = new ScheduledTripsModel();

        const tripData = {
            trip_id: 700000,
            email_address: 'tbanderson@mail.fhsu.edu',
            departure_latitude: '40.712776',
            departure_longitude: '-74.006000',
            destination_latitude: '40.712796',
            destination_longitude: '74.005974',
            departure_date: new Date(),
            mobile_number: null,
            mobile_provider: null,
            user_id_discord: null,
            user_id_slack: null,
            notification_status: null
        };


        scheduledTripsModel.updateNotificationStatus = jest.fn().mockReturnValue('Removed database interafactions with mock');

        jest.spyOn(NotificationController.prototype, 'sendMessage').mockResolvedValue({ code: 200, message: 'Success' });
        const result = await scheduleController.processTrip(tripData);
        scheduleController.closeDatabaseConnection();

        expect(result).toHaveProperty("trip_id", tripData.trip_id);
        expect(result).toHaveProperty("time");
        expect(result).toHaveProperty("returnMessage", { code: 200, message: 'Success' });


    });



});