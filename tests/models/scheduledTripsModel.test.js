const ScheduledTripsModel = require('../../models/scheduledTripsModel');


describe('TC-5:TC-7 ScheduledTripsModel', () => {

    let tripsModel;


    beforeAll(() => {
        // Initialize the model once for all tests
        tripsModel = new ScheduledTripsModel('test_scheduled_trips');
    });



    afterAll(async () => {
        await tripsModel.close();
    });



    it('TC-5: Set valid trip details; data is inserted and success message returned', async () => {

        const validTrip = {
            email_address: 'test@test.com',
            departure_latitude: '38.872944508400714',
            departure_longitude: '-99.34445344258867',
            destination_latitude: '38.895660556826314',
            destination_longitude: '-99.31664430129287',
            departure_date: new Date(),
            mobile_number: '555-555-2000',
            mobile_provider: 'tmomail.net',
            user_id_discord: 'JohnTestDiscord',
            user_id_slack: 'JohnTestSlack',
            notification_status: null
        }


        const returnMessage = await tripsModel.createTrip(validTrip);

        expect(returnMessage).toHaveProperty('success', true);
        expect(returnMessage).toHaveProperty('data');
        expect(returnMessage).toHaveProperty('message');
        expect(returnMessage.message).toContain('Trip created with ID: ');




    }, 100000);

    it('TC-5: Set invalid trip details; data is not inserted and error message returned', async () => {


        const invalidTrip = {
            email_address: null,
            departure_latitude: null,
            departure_longitude: null,
            destination_latitude: null,
            destination_longitude: null,
            departure_date: null,
            mobile_number: null,
            mobile_provider: null,
            user_id_discord: null,
            user_id_slack: null,
            notification_status: null
        }

        const returnMessage = await tripsModel.createTrip(invalidTrip);

        expect(returnMessage).toHaveProperty('success', false);
        expect(returnMessage).toHaveProperty('data', null);
        expect(returnMessage).toHaveProperty('message');
        expect(returnMessage.message).toContain('An error has occurred: ');




    }, 100000);

    it('TC-6: Set valid trip id; notification status updated and updated data returned in success message', async () => {


        const tripId = 2;
        const status = 'sent';
        const firstResultIndex = 0;

        const returnMessage = await tripsModel.updateNotificationStatus(tripId, status);

        expect(returnMessage).toHaveProperty('success', true);
        expect(returnMessage).toHaveProperty('data');
        expect(returnMessage).toHaveProperty('message', null);
        expect(returnMessage.data[firstResultIndex].trip_id).toEqual(tripId);
        expect(returnMessage.data[firstResultIndex].notification_status).toEqual(status);


    }, 100000);


    it('TC-6: Set invalid trip id; status not updated, no updated data returned', async () => {


        const tripId = -5;
        const status = 'sent';
        const returnMessage = await tripsModel.updateNotificationStatus(tripId, status);


        expect(returnMessage).toHaveProperty('success', false);
        expect(returnMessage).toHaveProperty('data', null);
        expect(returnMessage).toHaveProperty('message');
        expect(returnMessage.message).toContain('Trip with ID ');
        expect(returnMessage.message).toContain('not found.');

    }, 100000);


    it('TC-7: Set valid start and offset in minutes; success message returned with expected number of records', async () => {

        const start = new Date('2999-01-01 00:00:00Z');
        const offsetMinutes = 15;
        const returnMessage = await tripsModel.getUpcomingTrips(start, offsetMinutes);


        expect(returnMessage).toHaveProperty('success', true);
        expect(returnMessage.data.length).toEqual(1);
        expect(returnMessage).toHaveProperty('data');
        expect(returnMessage).toHaveProperty('message', null);

    }, 100000);

});
