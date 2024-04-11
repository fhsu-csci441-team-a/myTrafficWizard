/* The notificationController.js file orchestrates message sending
      It instantiates objects of weatherController & travelController
      It instantiates a messageModel object to properly format messages
      It instantiates objects of gmailController, slackBotController, 
         and/or discordBotController to send alerts
*/

const TravelController = require('./travelController');
// const WeatherController = require('./weatherController');
const MessageModel = require('../models/messageModel');
const GmailController = require('./gmailController');
const SlackBotController = require('./slackBotController');
const DiscordBotController = require('./discordBotController');

class NotificationController {

    #tripData;
    #travelObject;
    #weatherObject;
    #messageObject;
    #gmailControllerObject;
    #gmailControllerObject2;
    #slackBotControllerObject;
    #discordBotControllerObject;

    constructor(tripData) {
        this.#tripData = tripData;
        this.#instantiateTravelObject(tripData);
        this.#weatherObject;
        this.#messageObject;
        this.#gmailControllerObject;
        this.#gmailControllerObject2;
        this.#slackBotControllerObject = new SlackBotController();
        this.#discordBotControllerObject = new DiscordBotController();
    }

    #instantiateTravelObject(tripData) {
        this.#travelObject = new TravelController(
            tripData.departure_latitude + "," + tripData.departure_longitude,
            tripData.destination_latitude + "," + tripData.destination_longitude,
            process.env.TOMTOM_API_KEY);

    }

    createMessageObject(travelData, weatherData) {
        this.#messageObject = new MessageModel(travelData, weatherData);
    }

    createGmailObject(emailAddress, messageObject) {
        this.#gmailControllerObject = new GmailController(emailAddress, messageObject);
    }

    getMessageObject() {
        return this.#messageObject;
    }

    getTripData() {
        return this.#tripData;
    }

    async fetchTravelData() {
        return await this.#travelObject.getTravelMessage();

    }

    async sendGMail() {

        return this.#gmailControllerObject.sendGMail();
    }

    async postSlackMessage(userId, message) {
        return await this.#slackBotControllerObject.postMessage(userId, message);
    }

    async postDiscordMessage(userId, message) {
        return await this.#discordBotControllerObject.postMessage(userId, message);
    }

    async sendMessage() {

        // get current travel and weather data
        const travelData = await this.fetchTravelData();

        // const weatherData = await this.#weatherObject.getWeatherMessage();
        const weatherData = "";

        // set travel/weather data in mesage model
        this.createMessageObject(travelData, weatherData);

        // retrieve formatted message versions
        const plainTextMessage = await this.#messageObject.getTextMessage();

        // send notification to email - default message channel - & SMS (if provided)
        var recipients = this.#tripData.email_address
        if (this.#tripData.mobile_number && this.#tripData.mobile_provider) {
            recipients += "," + this.#tripData.mobile_number + this.#tripData.mobile_provider;
        }
        this.createGmailObject(recipients, this.#messageObject);
        await this.sendGMail();

        // send Slack message if slack ID provided
        if (this.#tripData.user_id_slack) {
            console.log('Attempting to send Slack message to user:', this.#tripData.user_id_slack);
            try {
                await this.postSlackMessage(
                    this.#tripData.user_id_slack, plainTextMessage);
                console.log('Slack message sent successfully');
            } catch (error) {
                console.error('Failed to send Slack message:', error);
            }
        }

        // send Discord message if Discord ID provided
        if (this.#tripData.user_id_discord) {
            console.log('Attempting to send message to Discord user: ', this.#tripData.user_id_discord);
            try {
                await this.postDiscordMessage(
                    this.#tripData.user_id_discord, plainTextMessage);
            } catch (error) {
                console.error('Failed to send Discord message:', error);
            }
        }
    }
}

module.exports = NotificationController;