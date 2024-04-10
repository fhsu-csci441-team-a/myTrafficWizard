/**
 * 'messageModel' maintains the formatted message output used when sending a 
 * scheduled notification to a user.
 */

class messageModel {
    #tripData;
    #weatherData;

    /**
     * Constructs an instance of messageModel.
     * It initializes the instance with relevant trip data and relevant weather 
     * data for the current message.
     * 
     * @param {JSON} tripData Key-value pairs of relevant trip data in JSON format.
     *                        It provides traffic details when crafting the message.
     * @param {JSON} weatherData Key-value pairs of weather data in JSON format.
     *                           It provides weather details when crafting the message.
     */
    constructor(tripData, weatherData) {
        this.#tripData = tripData;
        this.#weatherData = weatherData;
    }

    /**
     * Provides for the modification of tripData after the messageModel is created.
     * 
     * @param {JSON} tripData  Key-value pairs of relevant trip data in JSON format.
     *                        It provides traffic details when crafting the message.
     */
    setTripData(tripData) {
        this.#tripData = tripData;
    }

    /**
     * Retrieve the raw JSON tripData in this instance of messageModel.
     * 
     * @returns {JSON} The JSON key-value pairs that make up tripData for this message.
     */
    getTripData() {
        return this.#tripData;
    }

    /**
     * Provides for the modification of weatherData after the messageModel is created.
     * 
     * @param {JSON} weatherData Key-value pairs of weather data in JSON format.
     *                           It provides weather details when crafting the message.
     */
    setWeatherData(weatherData) {
        this.#weatherData = weatherData;
    }
    
    /**
     * Retrieve the raw JSON weatherData in this instance of messageModel.
     * 
     * @returns {JSON} The JSON key-value pairs that make up weatherData for this message.
     */
    getWeatherData() {
        return this.#tripData;
    }

    /**
     * Creates the text message when notifications are sent to the user.
     * 
     * @returns {string} The formatted text message sent to the user.
     * 
     * Usage Example: 
     *  const message = new messageModel(tripData, weatherData);
     *  console.log(message.getTextMessage());
     */
    getTextMessage() {
        return 'This is a notification message from myTrafficWizard.\n' +
               'You may find the following traffic data useful:\n\n' +                
               this.#tripData.text +
               '\n\n You should also be aware of the weather:\n\n' +
               this.#weatherData.text;
    }

    /**
     * Creates the HTML message when notifications are sent to the user.
     * 
     * @returns {string} The formatted message sent to the user in HTML format.
     * 
     * Usage Example: 
     *  const message = new messageModel(tripData, weatherData);
     *  console.log(message.getHTMLMessage());
     */
    getHTMLMessage() {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>myTrafficWizard</title>
        </head>
        <body>
        <h1>This is an notification message from myTrafficWizard.</h1>
        <div>
            <h2>Here is traffic data for your current trip:</h2>
            ${this.#tripData.html}
        </div>
        <div>
            <h2>You might find this weather data useful too:</h2>
            ${this.#weatherData.html}
        </div>
        </body>
        </html>`;
    }
}

module.exports = messageModel;