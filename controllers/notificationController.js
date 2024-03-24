class NotificationController {
    constructor(tripID) {
        this.tripID = tripID;
        this.scheduledTripsObject = new scheduledTripsModel();
        this.travelObject;
        this.weatherObject;
        this.messageObject = new MessageModel();
        this.gmailControllerObject;
        this.slackBotControllerObject = new SlackBotController();
        this.discordBotControllerObject = new DiscordBotController();
    }

    async sendMessage() {
        // lookup trip details from database
        const tripDetails = await this.scheduledTripsObject.getTripById(this.tripID);

        // create travelObject with trip details
        this.travelObject = new TravelController(
            [tripDetails.departure_latitude, tripDetails.departure_longitude], 
            [tripDetails.destination_latitude, tripDetails.destination_longitude]);
        this.weatherObject = new WeatherController(
            [tripDetails.departure_latitude, tripDetails.departure_longitude], 
            [tripDetails.destination_latitude, tripDetails.destination_longitude]);

        // get current travel and weather data
        const travelData = await this.travelObject.getTravelMessage();
        const weatherData = await this.weatherObject.getWeatherMessage();
        
        // set travel/weather data in mesage model
        this.messageObject.setTripData(travelData);
        this.messageObject.setWeatherData(weatherData);
        
        // retrieve formatted message versions
        plainTextMessage = this.messageObject.getTextMessage();
        htmlMessage = this.messageObject.getHTMLMessage();
        
        // send notification to email - default message channel
        this.gmailControllerObject = new GmailController(
            [tripDetails.email_address], htmlMessage);
        await this.gmailControllerObject.sendMessage();

        // send messages to other selected channels
        // send SMS if mobile_number provided
        if (tripDetails.mobile_number) {
            this.gmailControllerObject2 = new GmailController(
                [tripDetails.mobile_number + "@" + tripDetails.mobile_provider], 
                htmlMessage);
            await this.gmailControllerObject2.sendMessage();
        }

        // send Slack message if slack ID provided
        if (tripDetails.user_id_slack) {
            await this.slackBotControllerObject.sendMessage(
                tripDetails.user_id_slack, plainTextMessage);
        }

        // send Discord message if Discord ID provided
        if (tripDetails.user_id_discord) {
            await this.discordBotControllerObject.sendMessage(
                tripDetails.user_id_discord, plainTextMessage);
        }
    }
}