const TravelController = require('./travelController');
// const WeatherController = require('./weatherController');
const MessageModel = require('../models/messageModel');
const GmailController = require('./gmailController');
const SlackBotController = require('./slackBotController');
const DiscordBotController = require('./discordBotController');

class NotificationController {

    #tripData;
    #travelObject;
    // #weatherObject;
    #messageObject;
    #gmailControllerObject;
    #gmailControllerObject2;
    #slackBotControllerObject;
    #discordBotControllerObject;
        
    constructor(tripData) {
        this.#tripData = tripData;
        this.#travelObject;
        // this.#weatherObject;
        this.#messageObject = new MessageModel();
        this.#gmailControllerObject;
        this.#gmailControllerObject2;
        this.#slackBotControllerObject = new SlackBotController();
        this.#discordBotControllerObject;
    }

    async sendMessage() {

        // create travelObject with trip details
        this.#travelObject = new TravelController(
            this.#tripData.departure_latitude + "," + this.#tripData.departure_longitude, 
            this.#tripData.destination_latitude + "," + this.#tripData.destination_longitude, 
            process.env.TOMTOM_API_KEY);
        // this.#weatherObject = new WeatherController(
        //     [this.#tripData.departure_latitude, this.#tripData.departure_longitude], 
        //     [this.#tripData.destination_latitude, this.#tripData.destination_longitude]);

        // get current travel and weather data
        const travelData = await this.#travelObject.getTravelMessage();
        // const weatherData = await this.#weatherObject.getWeatherMessage();
        
        // set travel/weather data in mesage model
        this.#messageObject.setTripData(travelData);
        // this.#messageObject.setWeatherData(weatherData);
        
        // retrieve formatted message versions
        const plainTextMessage = this.#messageObject.getTextMessage();
        const htmlMessage = this.#messageObject.getHTMLMessage();

        // send notification to email - default message channel
        this.#gmailControllerObject = new GmailController(
            this.#tripData.email_address, this.#messageObject);
        await this.#gmailControllerObject.sendGMail();

        // send messages to other selected channels
        // send SMS if mobile_number provided
        // if (this.#tripData.mobile_number) {
        //     this.#gmailControllerObject2 = new GmailController(
        //         [this.#tripData.mobile_number + "@" + this.#tripData.mobile_provider], 
        //         this.#messageObject);
        //     await this.#gmailControllerObject2.sendGMail();
        // }

        // send Slack message if slack ID provided
        if (this.#tripData.user_id_slack) {
            console.log('Attempting to send Slack message to user:', this.#tripData.user_id_slack);
            try {
                await this.#slackBotControllerObject.postMessage(
                    this.#tripData.user_id_slack, plainTextMessage);
                console.log('Slack message sent successfully');
            } catch (error) {
                console.error('Failed to send Slack message:', error);
            }
        }

        // send Discord message if Discord ID provided
        if (this.#tripData.user_id_discord) {
            await this.#discordBotControllerObject.sendMessage(
                this.#tripData.user_id_discord, plainTextMessage);
        }
    }
}

module.exports = NotificationController;