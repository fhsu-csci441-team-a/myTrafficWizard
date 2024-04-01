const messageModel = require('../../models/messageModel');

describe('TC-15: messageModel', () => {

    const validTripData = { text: 'Valid trip data', html: '<p>Valid trip data</p>' };
    const validWeatherData = { text: 'Valid weather data', html: '<p>Valid weather data</p>' };
    const invalidTripData = { text: undefined, html: undefined };
    const invalidWeatherData = { text: undefined, html: undefined };

    it('TC-15: Instantiate object with incorrect travel and incorrect weather data; the text and html message returned are not properly formatted', () => {


        const message = new messageModel(invalidTripData, invalidWeatherData);
        const textMessage = message.getTextMessage();
        const htmlMessage = message.getHTMLMessage();

        expect(textMessage).toContain('undefined');
        expect(htmlMessage).toContain('undefined');
    });

    it('TC-15: Instantiate object with incorrect travel and correct weather data; the text and html message returned are not properly formatted', () => {


        const message = new messageModel(invalidTripData, validWeatherData);
        const textMessage = message.getTextMessage();
        const htmlMessage = message.getHTMLMessage();


        expect(textMessage).toContain('Valid weather data');
        expect(htmlMessage).toContain('<p>Valid weather data</p>');

        expect(textMessage).toContain('undefined');
        expect(htmlMessage).toContain('undefined');
    });

    it('TC-15: Instantiate object with correct travel data and incorrect weather data; the text and html message returned are not properly formatted', () => {


        const message = new messageModel(validTripData, invalidWeatherData);
        const textMessage = message.getTextMessage();
        const htmlMessage = message.getHTMLMessage();

        expect(textMessage).toContain('Valid trip data');
        expect(htmlMessage).toContain('<p>Valid trip data</p>');

        expect(textMessage).toContain('undefined');
        expect(htmlMessage).toContain('undefined');
    });

    it('TC-15: Instantiate object with correct travel and weather data; the text and html message returned are properly formatted', () => {


        const message = new messageModel(validTripData, validWeatherData);
        const textMessage = message.getTextMessage();
        const htmlMessage = message.getHTMLMessage();

        expect(textMessage).toContain('Valid trip data');
        expect(textMessage).toContain('Valid weather data');
        expect(htmlMessage).toContain('<p>Valid trip data</p>');
        expect(htmlMessage).toContain('<p>Valid weather data</p>');
    });


});