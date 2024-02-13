/**
 * The TravelTimeModel class extends BaseFetchRetry to calculate and provide travel times
 * between two points using the TomTom Routing API. It supports fetching travel times under
 * various conditions including historical traffic, live traffic, and no traffic scenarios,
 * as well as calculating travel delays. This class encapsulates all interactions with the
 * routing API, providing a simple interface for obtaining travel time information.
 * 
 
 * 
 * Usage Example:
 * const travelTimeModel = new TravelTimeModel("52.41072,4.84239", "52.41072,4.84239", "your_api_key_here");
 * const travelTimes = await travelTimeModel.getTravelTimes();
 * 
 * Note:
 * This class requires a valid API key from TomTom and internet access to perform API requests.
 * It is designed to be used as part of larger applications where travel time information is needed.
 * 
 * Dependencies:
 * - Requires '../services/BaseFetchRetry' for API request retries.
 * 
 * Module Exports:
 * - TravelTimeModel class for external use.
 */

const BaseFetchRetry = require('../services/BaseFetchRetry');

class TravelTimeModel extends BaseFetchRetry {

    static #travelMode = 'car';
    static #computeTravelTimeFor = 'all';
    static #versionNumber = 1;
    static #routeRepresentation = 'summaryOnly';
    static #headers = { "Content-Type": "application/json" }

    #historicalTravelTimeMinutes;
    #liveTrafficTravelTimeMinutes;
    #noTrafficTravelTimeMinutes;
    #travelDelayMinutes;


    /**
     * This constructor initializes the object with start and end points for the route,
     * an API key for authentication, and constructs the request URL with these parameters
     * along with predefined options for travel mode, computation preferences, and route representation.
     * It then initializes the base class (BaseFetchRetry) with the constructed URL and HTTP request options.
     * 
     * @param {string} startPoint The starting point of the route, formatted as a string with latitude and longitude separated by a comma (e.g., "52.41072,4.84239").
     * @param {string} endPoint The end point of the route, formatted in the same manner as the starting point.
     * @param {string} apiKey The API key for authenticating requests to the routing service.
     * 
     * Usage:
     * const travelTimeModel = new TravelTimeModel("52.41072,4.84239", "52.41072,4.84239", "your_api_key_here");
     * 
     */
    constructor(startPoint, endPoint, apiKey) {


        const url = `https://api.tomtom.com/routing/${TravelTimeModel.#versionNumber}/calculateRoute/${startPoint}:${endPoint}/json?key=${apiKey}&travelMode=${TravelTimeModel.#travelMode}&computeTravelTimeFor=${TravelTimeModel.#computeTravelTimeFor}&routeRepresentation=${TravelTimeModel.#routeRepresentation}`;

        //Initialize the BaseFetchEntry class with the URL and API key
        super(url, { method: "GET", headers: TravelTimeModel.#headers });

    }


    /**
     * Privately calculates the travel times between the start and end points previously set in the constructor.
     * This method asynchronously fetches route data using the configured API and parses the response to extract
     * historical travel time, live traffic travel time, no traffic travel time, and travel delay minutes.
     * These times are then stored as private fields within the instance.
     * 
     * Intended for internal use to ensure updated travel times before retrieval via `getTravelTimes`.
     * 
     * Errors during fetch or data parsing are logged to the console.
     * 
    */
    async #calculateTravelTimes() {
        try {
            const result = await this.fetch();
            const routes = result.routes;

            if (routes && routes.length > 0) {
                const route = routes[0];
                const summary = route.summary;
                this.#historicalTravelTimeMinutes = Math.trunc(summary.historicTrafficTravelTimeInSeconds / 60);
                this.#liveTrafficTravelTimeMinutes = Math.trunc(summary.liveTrafficIncidentsTravelTimeInSeconds / 60);
                this.#noTrafficTravelTimeMinutes = Math.trunc(summary.noTrafficTravelTimeInSeconds / 60);
                this.#travelDelayMinutes = Math.trunc(summary.trafficDelayInSeconds / 60)
            }


        } catch (error) {
            console.error('Failed to calculate travel times data:', error);
        }
    }

    /**
     * Retrieves the latest travel time details by first ensuring the travel times are calculated.
     * This method triggers a refresh of travel times (historical, live traffic, no traffic, and travel delay)
     * by calling the private `#calculateTravelTimes` method, then returns these times in an object.
     * The actual travel times are dependent on the latest data fetched from the routing API.
     * 
     * Returns:
     * An object containing travel tihmes in minutes for historical conditions, live traffic conditions,
     * no traffic conditions, and te current travel delay. If the objects contains all undefined fields, it indicates
     * that an error occured.
    */
    async getTravelTimes() {
        await this.#calculateTravelTimes(); // Ensure the travel times are calculated

        // Return an object with the required travel times
        return {
            historicalTravelTimeMinutes: this.#historicalTravelTimeMinutes,
            liveTrafficTravelTimeMinutes: this.#liveTrafficTravelTimeMinutes,
            noTrafficTravelTimeMinutes: this.#noTrafficTravelTimeMinutes,
            travelDelayMinutes: this.#travelDelayMinutes
        };
    }
}

module.exports = TravelTimeModel;