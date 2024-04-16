// Originally written and debugged by Nicole-Rene Newcomb
// Updated by Tyler Anderson

/* The notificationController.js file orchestrates message sending
      It instantiates objects of weatherController & travelController
      It instantiates a messageModel object to properly format messages
      It instantiates objects of gmailController, slackBotController, 
         and/or discordBotController to send alerts
*/

// required components
const TravelController = require('./travelController');
// const WeatherController = require('./weatherController');
const MessageModel = require('../models/messageModel');
const GmailController = require('./gmailController');
const SlackBotController = require('./slackBotController');
const DiscordBotController = require('./discordBotController');

// Class of the NotificationController that orchestrates message sending
class NotificationController {

    #tripData;
    #travelObject;
    // #weatherObject;
    #messageObject;
    #gmailControllerObject;
    #gmailControllerObject2;
    #slackBotControllerObject;
    #discordBotControllerObject;

    // construct the NotificationController object
    constructor(tripData) {
        this.#tripData = tripData;
        this.#instantiateTravelObject(tripData);
        // this.#instantiateWeatherObject(tripData);
        this.#messageObject;
        this.#gmailControllerObject;
        this.#gmailControllerObject2;
        this.#slackBotControllerObject;
        this.#discordBotControllerObject;
    }

    // instantiate the travel object with tripData
    #instantiateTravelObject(tripData) {
        this.#travelObject = new TravelController(
            tripData.departure_latitude + "," + tripData.departure_longitude,
            tripData.destination_latitude + "," + tripData.destination_longitude,
            process.env.TOMTOM_API_KEY);

    }

    // // instantiate the travel object with tripData
    // #instantiateWeatherObject(tripData) {
    //     this.#weatherObject = new WeatherController(
    //         tripData.departure_latitude + "," + tripData.departure_longitude,
    //         tripData.destination_latitude + "," + tripData.destination_longitude,
    //         process.env.TOMORROW_API_KEY,
    //         process.env.TOMTOM_API_KEY);
    // }

    // create message object
    createMessageObject(travelData, weatherData) {
        this.#messageObject = new MessageModel(travelData, weatherData);
    }

    // create Gmail object
    createGmailObject(emailAddress, messageObject) {
        this.#gmailControllerObject = new GmailController(emailAddress, messageObject);
    }

    // create SlackBotController object
    createSlackObject() {
        this.#slackBotControllerObject = new SlackBotController();
    }

    // create DiscordBotController object
    createDiscordObject() {
        this.#discordBotControllerObject = new DiscordBotController();
    }

    // get the message object
    getMessageObject() {
        return this.#messageObject;
    }

    // get the tripData
    getTripData() {
        return this.#tripData;
    }

    // get the travel message
    async fetchTravelData() {
        return await this.#travelObject.getTravelMessage();
    }

    // // get the weather message
    // async fetchWeatherData() {
    //     return await this.#weatherObject.getWeatherMessage();
    // }

    // send messages to Gmail
    async sendGMail() {
        return this.#gmailControllerObject.sendGMail();
    }

    // send message to Slack
    async postSlackMessage(userId, message) {
        return await this.#slackBotControllerObject.postMessage(userId, message);
    }

    // send message to Discord
    async postDiscordMessage(userId, message) {
        return await this.#discordBotControllerObject.postMessage(userId, message);
    }

    // main orchestration/driver method to send out all messages
    async sendMessage() {

        try {
            // get current travel and weather data
            const travelData = await this.fetchTravelData();
            // const weatherData = await this.fetchWeatherData();
            const weatherData = "temp placeholder";

            // set travel/weather data in mesage model
            this.createMessageObject(travelData, weatherData);

            // retrieve formatted message versions
            const plainTextMessage = await this.#messageObject.getTextMessage();

            // send notification to email - default message channel - & SMS (if provided)
            var recipients = this.#tripData.email_address
            if (this.#tripData.mobile_number && this.#tripData.mobile_provider) {
                recipients += "," + this.#tripData.mobile_number + this.#tripData.mobile_provider;
            }

            // create the Gmail object and send message to Gmail
            try {
                this.createGmailObject(recipients, this.#messageObject);
                await this.sendGMail();
            } catch (error) {
                return { code: 500, message: 'Failed to send to Gmail from NC' };
            }
            

            // send Slack message if slack ID provided
            if (this.#tripData.user_id_slack) {
                try {
                    console.log('Attempting to send Slack message to user:', this.#tripData.user_id_slack);
                    this.createSlackObject();
                    const response = await this.postSlackMessage(
                        this.#tripData.user_id_slack, plainTextMessage);
                    console.log('Slack message sent from NC');
                } catch (error) {
                    console.error('Failed to send Slack message:', error);
                    return { code: 500, message: 'Failed to send Slack message from NC' };
                }
            }

            // send Discord message if Discord ID provided
            if (this.#tripData.user_id_discord) {
                try {
                    console.log('Attempting to send message to Discord user: ', this.#tripData.user_id_discord);
                    this.createDiscordObject();
                    const response = await this.postDiscordMessage(
                        this.#tripData.user_id_discord, plainTextMessage);    
                    console.log('Discord message sent from NC');
                } catch (error) {
                    console.error('Failed to send Discord message:', error);
                    return { code: 500, message: 'Failed to send Discord message from NC' };
                }
            }

            // after all others process, send success message
            console.log("NC process finished!");
            return { code: 200, message: 'Messages Sent From NotificationController!' };
        } catch (error) {
            console.log("Error in NC: " + error);
            return "Error in NC: " + error;
        }
    }
}

module.exports = NotificationController;