/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const request = require('supertest');
const express = require('express');
const homeRoutes = require('../../../routes/homeRoutes');

const app = express();
app.use(express.json());
app.use(homeRoutes);

describe('TC-1: HomeController', () => {
    it('TC-1: A valid URL with an available file to load is requested, page loads', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
    });

    it('TC-1: An invalid URL or URL to a non-existent file is requested, page fails to load', async () => {
        const res = await request(app).get('/nonexistent');
        expect(res.statusCode).toEqual(404);
    });

    it('TC-2: A valid FormData object is received by the HomeController. the FormData object is properly assigned to the HomeController', async () => {
        const validData = {
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
            notification_status: null,
            table: 'test_scheduled_trips'
        };
        const res = await request(app).post('/submit').send(validData);
        expect(res).toHaveProperty('body');
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('Trip');
        expect(res.body.message).toContain('created!');
        expect(res.statusCode).toEqual(200);
    });



    it('TC-2: An invalid FormData object is received by the HomeController, no formSubmissionObject is assigned', async () => {

        const invalidData = {
            email_address: 'test@test.com',
            notification_status: null,
            table: 'test_scheduled_trips'
        };



        const res = await request(app).post('/submit').send(invalidData);

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'There was an error processing your form.');
    });



});