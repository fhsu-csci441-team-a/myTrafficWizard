const HomeController = require('../../controllers/homeController');
const ScheduledTripsModel = require('../../models/scheduledTripsModel');
require('dotenv').config();

describe('Integration Test: homeController=>scheduledTripsModel', () => {
    let homeController;
    let scheduledTripsModel;
    let table = 'test_scheduled_trips';

    beforeAll(() => {
        // Initialize the HomeController and ScheduledTripsModel
        homeController = new HomeController();
        scheduledTripsModel = new ScheduledTripsModel();
    });

    afterAll(async () => {
        await scheduledTripsModel.close();
    });

    it('homeController submits user entries to the database through the scheduledTripsModel', async () => {

        const formData = {
            email_address: 'test@test.com',
            departure_latitude: '40.712776',
            departure_longitude: '-74.005974',
            destination_latitude: '34.052235',
            destination_longitude: '-118.243683',
            departure_date: '2024-04-10T10:00:00Z',
            mobile_number: '555-555-5555',
            mobile_provider: 'AT&T',
            user_id_discord: 'test123',
            user_id_slack: 'test123',
            notification_status: null,
            table: table
        };

        const request = { body: formData };


        let capturedResponse = null;
        const response = {
            json: (data) => {
                capturedResponse = data;
            },
            status: function (statusCode) {
                this.statusCode = statusCode;
                return this;
            }
        };

        await homeController.formSubmission(request, response);

        expect(capturedResponse).toHaveProperty('message');
        expect(capturedResponse.message).toMatch(/Trip #\d+ created!/);

        const match = capturedResponse.message.match(/Trip #(\d+) created!/);
        const tripId = match ? parseInt(match[1], 10) : null;

        expect(tripId).not.toBeNull();

        queryResult = await scheduledTripsModel.getTripsById(tripId);
        expect(queryResult.data[0].trip_id).toEqual(tripId);

    });



});