const ScheduledTripsModel = require('../../models/scheduledTripsModel');
const { query } = require('../../config/databaseConnection');

jest.mock('../../config/databaseConnection', () => ({
    query: jest.fn(),
}));

describe('ScheduledTripsModel - TC-5', () => {
    let scheduledTripsModel;
    let dbConnection;

    beforeEach(() => {
        // Reset the mocks before each test
        query.mockClear();
        query.mockReset();

        // Create a new instance of the ScheduledTripsModel for each test
        scheduledTripsModel = new ScheduledTripsModel();
    });

    it('Sets valid trip details and inserts data into the database', async () => {
        const validTripDetails = {
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
        };
        query.mockResolvedValueOnce([{ trip_id: 1 }]);

        const result = await scheduledTripsModel.createTrip(validTripDetails);

        expect(query).toHaveBeenCalled();
        expect(result).toEqual({
            success: true,
            data: 1, // Assuming the createTrip method returns the trip_id on success
            message: 'Trip created with ID: 1'
        });
    });

    it('Sets invalid trip details and does not insert data into the database', async () => {
        const invalidTripDetails = {
            email_address: null,
            departure_latitude: null,
            departure_longitude: null,
            destination_latitude: '38.895660556826314',
            destination_longitude: '-99.31664430129287',
            departure_date: null,
            mobile_number: '555-555-2000',
            mobile_provider: 'tmomail.net',
            user_id_discord: 'JohnTestDiscord',
            user_id_slack: 'JohnTestSlack',
            notification_status: null
        };
        // Mocking a failed database operation
        query.mockRejectedValueOnce(new Error('Invalid trip details'));

        await expect(scheduledTripsModel.createTrip(invalidTripDetails)).rejects.toThrow('Invalid trip details');
        expect(query).toHaveBeenCalled();
    });
});

