/**
 * The TravelController class orchestrates fetching and presenting travel-related information,
 * including travel times and incidents along a specified route. It utilizes the TravelTimeModel
 * and TravelIncidentModel for fetching data and then formats this data as either text or HTML.
 * 
 * Example Usage:
 * ```javascript
 * const travelController = new TravelController('40.7128,-74.0060', '40.7831,-73.9712', 'yourApiKey');
 * travelController.getTravelMessage('text')
 *   .then(message => console.log(message))
 *   .catch(error => console.error(error));
 * ```
 * 
 * This class abstracts the complexities involved in fetching and formatting travel data,
 * providing a simple interface for generating user-friendly messages. It is designed to be
 * flexible, allowing for easy adjustments to the data fetching logic or the presentation format.
 */

const TravelTimeModel = require('../models/travelTimeModel');
const TravelIncidentModel = require('../models/travelIncidentModel');

class TravelController {

    constructor(start, end, apiKey) {
        this.start = start;
        this.end = end;
        this.apiKey = apiKey;

        this.travelTimeModel = new TravelTimeModel(this.start, this.end, this.apiKey);
        this.travelIncidentModel = new TravelIncidentModel(this.start, this.end, this.apiKey);

    }


    #getPluralityOfMinutes(minutes) {
        if (minutes > 1 && !minutes !== 0)
            return 'minutes';
        else
            return 'minute';
    }

    #isSuccessMessage(message) {
        return message.success == true || message.data;
    }

    async #generateMessageTemplateTravelTime(messageType = 'text') {
        let travelTime = await this.travelTimeModel.getTravelTimes();

        if (!this.#isSuccessMessage(travelTime))
            return null;


        const liveTravelTime = travelTime.data.liveTrafficTravelTimeMinutes - 1;
        const historicalTravelTime = travelTime.data.historicalTravelTimeMinutes;
        let template = "";

        template = `Your estimated travel time with live traffic conditions is currently ${liveTravelTime} ${this.#getPluralityOfMinutes(liveTravelTime)},` +
            ` the historical average for this route is ${historicalTravelTime} ${this.#getPluralityOfMinutes(historicalTravelTime)}.`;

        if (liveTravelTime > historicalTravelTime) {
            template += "\nThis is higher than usual, which might be due to an incident along your route.";
        } else if (liveTravelTime < historicalTravelTime) {
            template += "\nYou're in luck! Travel is quicker than usual today.";
        }


        if (messageType.toLowerCase() === 'html')
            template = '<p>' + template + '</p>';

        return template.trim();


    }

    #generateIncidentsHTMLTemplate(travelIncidents) {
        let listTemplate = `<ul style="list-style-type: none; padding: 0;">`;
        travelIncidents.forEach((incident, index) => {
            listTemplate += `
                <li style="margin-bottom: 10px;">
                    <strong>${index + 1}. ${incident.iconCategory}</strong>: From ${incident.from} to ${incident.to}. 
                    <em>Magnitude of delay:</em> ${incident.magnitudeOfDelay}.
                </li>`;
        });
        listTemplate += "</ul>";
        return listTemplate.trim();

    }

    #generateIncidentsTextTemplate(travelIncidents) {
        let textTemplate = '';
        travelIncidents.forEach((incident, index) => {
            let record = `${index + 1}. ${incident.iconCategory}: From ${incident.from} to ${incident.to}. Magnitude of delay: ${incident.magnitudeOfDelay}`;
            textTemplate += record + '\n';
        });
        return textTemplate.trim();

    }

    async #generateMessageTemplateTravelConditions(messageType = 'text') {
        let travelIncidentMessage = await this.travelIncidentModel.getTravelIncidents();
        let travelIncidents = travelIncidentMessage.data;


        if (!this.#isSuccessMessage(travelIncidentMessage))
            return null;

        return messageType.toLowerCase() === 'html' ?
            this.#generateIncidentsHTMLTemplate(travelIncidentMessage.data) :
            this.#generateIncidentsTextTemplate(travelIncidentMessage.data);

    }

    async getTravelMessage(messageType = 'text') {
        const travelTimeMessage = await this.#generateMessageTemplateTravelTime(messageType);
        const travelIncidentMessage = await this.#generateMessageTemplateTravelConditions(messageType);

        if (!(travelTimeMessage && travelIncidentMessage))
            return "Travel information could not be found, please try again.";


        let template = "";
        let travelTimeHeader = messageType.toLowerCase() === 'html' ? '<h3><b>Travel Times</b></h3>' : 'Travel Times:\n';
        let travelIncidentHeader = messageType.toLowerCase() === 'html' ? '<h3><b>Travel Incidents</b></h3>' : 'Travel Incidents:\n';
        let divider = messageType.toLowerCase() === 'html' ? '<br><br>' : '\n\n';
        template += travelTimeHeader;
        template += travelTimeMessage + divider;

        template += travelIncidentHeader;
        template += travelIncidentMessage + divider;

        return template;

    }




}

module.exports = TravelController;
