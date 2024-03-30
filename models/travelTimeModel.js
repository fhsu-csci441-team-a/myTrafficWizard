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




    #messageOperationSuccess(data, message = null) {
        return {
            success: true,
            data: data,
            message: message
        }
    }


    #messageOperationFailure(error) {
        return {
            success: false,
            data: null,
            message: `An error has occurred: ${error}`
        };
    }


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
