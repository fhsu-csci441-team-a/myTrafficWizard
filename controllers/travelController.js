/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

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
const ReverseGeocode = require('../services/reverseGeocode');

class TravelController {
    #apiKey;

    constructor(start, end, apiKey) {
        this.start = start;
        this.end = end;
        this.#apiKey = apiKey;

        this.travelTimeModel = new TravelTimeModel(this.start, this.end, this.#apiKey);
        this.travelIncidentModel = new TravelIncidentModel(this.start, this.end, this.#apiKey);
        this.reverseGeocode = new ReverseGeocode(this.#apiKey)

    }


    /**
     * Determines the appropriate plurality of the word "minute" based on the provided number.
     * 
     * @param {number} minutes - The number of minutes to evaluate.
     * @returns {string} Returns 'minutes' if the input is greater than 1 and not 0, otherwise returns 'minute'.
     */
    #getPluralityOfMinutes(minutes) {
        if (minutes > 1 && !minutes !== 0)
            return 'minutes';
        else
            return 'minute';
    }

    /**
     * Checks if the given message object represents a successful operation.
     * 
     * @param {Object} message - The message object to evaluate, typically containing a success property and data.
     * @returns {boolean} True if the message indicates success (either through a true success property or presence of data), otherwise false.
     */

    #isSuccessMessage(message) {
        return message.success == true || message.data;
    }


    /**
     * Determines if the provided message object contains travel incidents data.
     * 
     * @param {Object} message - The message object that potentially contains travel incident data.
     * @returns {boolean} True if there are one or more travel incidents in the data, otherwise false.
     */

    #hasTravelIncidents(message) {
        return message.data && message.data.length > 0;
    }


    /**
     * Asynchronously generates a message template describing travel times, formatted as either text or HTML.
     * 
     * @param {string} [messageType='text'] - The format of the output message ('text' or 'html').
     * @returns {string} A formatted string describing current and historical travel times, potentially with additional context regarding traffic conditions.
     */
    async #generateMessageTemplateTravelTime(messageType = 'text') {
        let travelTime = await this.travelTimeModel.getTravelTimes();


        if (!this.#isSuccessMessage(travelTime)) {
            const errorMessage = `The following error occurred when retrieving travel times:\n${travelTime.message} `
            return messageType === 'html' ? '<p>' + errorMessage + '</p>' : errorMessage;
        }



        const liveTravelTime = travelTime.data.liveTrafficTravelTimeMinutes - 1;
        const historicalTravelTime = travelTime.data.historicalTravelTimeMinutes;
        let template = "";

        template += `Your estimated travel time with live traffic conditions is currently ${liveTravelTime} ${this.#getPluralityOfMinutes(liveTravelTime)},` +
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

    /**
     * Generates an HTML formatted list describing travel incidents.
     * 
     * @param {Array} travelIncidents - An array of incident objects to be formatted.
     * @returns {string} An HTML string listing travel incidents with details.
     */

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

    /**
     * Generates a plain text formatted list of travel incidents.
     * 
     * @param {Array} travelIncidents - An array of incident objects to be formatted.
     * @returns {string} A plain text string listing travel incidents with details.
     */
    #generateIncidentsTextTemplate(travelIncidents) {
        let textTemplate = '';
        travelIncidents.forEach((incident, index) => {
            let record = `${index + 1}. ${incident.iconCategory}: From ${incident.from} to ${incident.to}. Magnitude of delay: ${incident.magnitudeOfDelay}`;
            textTemplate += record + '\n';
        });
        return textTemplate.trim();

    }

    /**
     * Asynchronously generates a message template describing travel conditions, formatted as either text or HTML based on provided incidents.
     * 
     * @param {string} [messageType='text'] - The format of the output message ('text' or 'html').
     * @returns {string} A formatted string describing travel incidents, or a notification of no incidents.
     */

    async #generateMessageTemplateTravelConditions(messageType = 'text') {
        let travelIncidentMessage = await this.travelIncidentModel.getTravelIncidents();
        let travelIncidents = travelIncidentMessage.data;

        if (!this.#isSuccessMessage(travelIncidentMessage)) {
            const errorMessage = `The following error occurred when retrieving travel incidents:\n${travelIncidentMessage.message} `
            return messageType === 'html' ? '<p>' + errorMessage + '</p>' : errorMessage;
        }

        if (!this.#hasTravelIncidents(travelIncidentMessage)) {
            return 'We have great news, no travel incidents were found in the areas close to or on your route.'
        }

        return messageType.toLowerCase() === 'html' ?
            this.#generateIncidentsHTMLTemplate(travelIncidentMessage.data) :
            this.#generateIncidentsTextTemplate(travelIncidentMessage.data);

    }

    /**
     * Asynchronously combines travel time and incident messages into a single template, formatted as either text or HTML.
     * 
     * @param {string} [messageType='text'] - The format of the output message ('text' or 'html').
     * @returns {string} A comprehensive template that includes both route details and travel conditions.
     */
    async #generateMessageTemplateCombined(messageType = 'text') {
        const travelTimeMessage = await this.#generateMessageTemplateTravelTime(messageType);
        const travelIncidentMessage = await this.#generateMessageTemplateTravelConditions(messageType);
        const startAddress = await this.reverseGeocode.getAddress(this.start);
        const endAddress = await this.reverseGeocode.getAddress(this.end);

        let template = "";
        let routeHeader = messageType.toLowerCase() === 'html' ? '<h3><b>Route</b></h3>' : 'Route:\n';
        let travelTimeHeader = messageType.toLowerCase() === 'html' ? '<h3><b>Travel Times</b></h3>' : 'Travel Times:\n';
        let travelIncidentHeader = messageType.toLowerCase() === 'html' ? '<h3><b>Travel Incidents</b></h3>' : 'Travel Incidents:\n';
        let divider = messageType.toLowerCase() === 'html' ? '<br><br>' : '\n\n';

        template += routeHeader;
        template += `Departure Address: ${startAddress.data}`
        template += divider;
        template += `Destination Address: ${endAddress.data}`
        template += divider;

        template += travelTimeHeader;
        template += travelTimeMessage + divider;

        template += travelIncidentHeader;
        template += travelIncidentMessage + divider;

        return template;

    }

    /**
     * Asynchronously retrieves both HTML and text travel messages using combined templates for travel times and incidents.
     * 
     * @returns {Object} An object containing both HTML and text formatted messages regarding travel conditions.
     */

    async getTravelMessage() {
        const htmlMessage = await this.#generateMessageTemplateCombined('html');
        const textMessage = await this.#generateMessageTemplateCombined('text');

        return {
            "html": htmlMessage,
            "text": textMessage
        }
    }




}

module.exports = TravelController;
