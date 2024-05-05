/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

/**
 * The TravelTimeModel class is designed to calculate and provide travel times
 * between two geographical points using the TomTom Routing API. It extends the BaseFetchRetry
 * class to leverage retry capabilities for API requests. This model supports fetching travel
 * times considering various traffic conditions.
 * 
 * Example usage:
 * ```
 * const travelTimeModel = new TravelTimeModel("52.41072,4.84239", "52.41072,4.84239", "your_api_key");
 * travelTimeModel.getTravelTimes()
 *     .then((result) => console.log(result))
 *     .catch((error) => console.error(error));
 * ```
 */
const BaseFetchRetry = require('../services/BaseFetchRetry');

class TravelTimeModel extends BaseFetchRetry {

    static TRAVEL_MODE = 'car';
    static COMPUTE_TRAVEL_TIME_FOR = 'all';
    static VERSION_NUMBER = 1;
    static ROUTE_REPRESENTATION = 'summaryOnly';
    static HEADERS = { "Accept": "application/json", "Content-Type": "application/json" };



    constructor(startPoint, endPoint, apiKey) {

        const url = `https://api.tomtom.com/routing/${TravelTimeModel.VERSION_NUMBER}/calculateRoute/${startPoint}:${endPoint}/json` +
            `?key=${apiKey}&travelMode=${TravelTimeModel.TRAVEL_MODE}&computeTravelTimeFor=${TravelTimeModel.COMPUTE_TRAVEL_TIME_FOR}` +
            `&routeRepresentation=${TravelTimeModel.ROUTE_REPRESENTATION}`;

        super(url, { method: "GET", headers: TravelTimeModel.HEADERS });
    }


    /**
     * Constructs a success message object for operations, typically used in API responses or internal communications.
     * This method formats the response to indicate a successful outcome, optionally including a message for additional context.
     *
     * @param {any} data - The data to be included in the success message. This could be any type of data retrieved or affected by the operation.
     * @param {string|null} [message=null] - An optional descriptive message providing more details about the success. Defaults to null if not provided.
     * @returns {Object} Returns an object structured to indicate success, containing the provided data and an optional message.
     */

    #messageOperationSuccess(data, message = null) {
        return {
            success: true,
            data: data,
            message: message
        }
    }

    /**
     * Constructs a failure message object for operations, typically used in API responses or internal error handling.
     * This method formats the response to clearly indicate an operation failure, including a detailed error message.
     *
     * @param {Error|string} error - The error encountered during the operation. This could be an Error object or a simple string describing the issue.
     * @returns {Object} Returns an object structured to indicate failure, with no data and an error message explaining what went wrong.
     */

    #messageOperationFailure(error) {
        return {
            success: false,
            data: null,
            message: `An error has occurred: ${error}`
        };
    }


    /**
     * Asynchronously calculates travel times based on route information fetched from an external API.
     * This method extracts travel times under different traffic conditions from the first route in the fetched data.
     *
     * @returns {Promise<Object>} A promise that resolves to an object containing travel times:
     * - historicalTravelTimeMinutes: Time in minutes based on historical traffic data.
     * - liveTrafficTravelTimeMinutes: Time in minutes adjusted for current traffic conditions.
     * - noTrafficTravelTimeMinutes: Time in minutes if there were no traffic delays.
     * - travelDelayMinutes: Additional minutes caused by current traffic compared to no traffic conditions.
     * If no route data is available, the promise resolves to an empty object.
     */
    async #calculateTravelTimes() {

        const response = await this.fetchWithRetry();
        if (!response.routes || response.routes.length === 0) {
            return {};
        }

        const summary = response.routes[0].summary;
        return {
            historicalTravelTimeMinutes: Math.trunc(summary.historicTrafficTravelTimeInSeconds / 60),
            liveTrafficTravelTimeMinutes: Math.trunc(summary.liveTrafficIncidentsTravelTimeInSeconds / 60),
            noTrafficTravelTimeMinutes: Math.trunc(summary.noTrafficTravelTimeInSeconds / 60),
            travelDelayMinutes: Math.trunc(summary.trafficDelayInSeconds / 60)
        };

    }


    /**
     * Asynchronously retrieves travel times using the `#calculateTravelTimes` method and returns them in a structured message format.
     * This method handles the overall process of fetching travel time data and formats the response based on the success or failure of the operation.
     *
     * @returns {Promise<Object>} A message operation success object containing the travel times if data is found,
     * or a message indicating no routes were found, or a failure object if an error occurs during data retrieval.
     */
    async getTravelTimes() {

        try {
            const travelTimes = await this.#calculateTravelTimes();

            if (!travelTimes) {
                return this.#messageOperationSuccess(travelTimes, 'No routes found');
            }

            return this.#messageOperationSuccess(travelTimes);

        }
        catch (error) {
            return this.#messageOperationFailure(error);
        }

    }





}

module.exports = TravelTimeModel;
