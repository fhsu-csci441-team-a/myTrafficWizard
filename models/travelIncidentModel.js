/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/


/**
 * The TravelIncidentsModel class extends BaseFetchRetry to fetch traffic incident data
 * for a specified route. It constructs a request to a traffic API, automatically handling
 * retries for transient errors and rate limits, and parses the response into a structured format.
 * Incidents are sorted by severity with a predefined order and only the top 10 severe incidents are returned.
 *
 
 *
 * Example Usage:
 * ```javascript
 * const incidentsModel = new TravelIncidentsModel("52.50931,13.42936", "52.50274,13.43872", "yourApiKey");
 * incidentsModel.getTravelIncidents()
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 * ```
 *
 * 
 *
 */

const BaseFetchRetry = require('../services/BaseFetchRetry');

class TravelIncidentsModel extends BaseFetchRetry {
    static VERSION_NUMBER = '5';
    static HEADERS = { "Content-Type": "application/json" };
    static ICON_CATEGORY_MAP = {
        0: "Unknown",
        1: "Accident",
        2: "Fog",
        3: "Dangerous Conditions",
        4: "Rain",
        5: "Ice",
        6: "Jam",
        7: "Lane Closed",
        8: "Road Closed",
        9: "Road Works",
        10: "Wind",
        11: "Flooding",
        12: "Broken Down Vehicle"
    }

    static MAGNITUDE_MAP = {
        0: "Unknown",
        1: "Minor",
        2: "Moderate",
        3: "Major",
        4: "Undefined"
    }

    static SEVERITY_SORT_ORDER = {
        "Major": 3,
        "Unknown": 2,
        "Undefined": 1,
        "Minor": 0,
        "Moderate": 0
    };


    constructor(startPoint, endPoint, apiKey) {

        const [startLatitude, startLongitude] = startPoint.split(',').map(Number);
        const [endLatitude, endLongitude] = endPoint.split(',').map(Number);

        const southLatitude = Math.min(startLatitude, endLatitude);
        const northLatitude = Math.max(startLatitude, endLatitude);
        const westLongitude = Math.min(startLongitude, endLongitude);
        const eastLongitude = Math.max(startLongitude, endLongitude);

        const url = `https://api.tomtom.com/traffic/services/${TravelIncidentsModel.VERSION_NUMBER}/incidentDetails?key=${apiKey}&bbox=${westLongitude},${southLatitude},${eastLongitude},${northLatitude}&fields={incidents{properties{id,magnitudeOfDelay,iconCategory,from,to}}}`;


        super(url, { method: "GET", headers: TravelIncidentsModel.HEADERS });
    }

    /**
     * Creates a standardized success message object for API responses.
     * This function is typically used when an operation has completed successfully and optionally includes additional data or a descriptive message.
     *
     * @param {any} data - The payload to return, typically data that was requested or affected by the operation.
     * @param {string|null} [message=null] - An optional message providing more details about the success.
     * @returns {Object} Returns an object indicating the operation was successful, along with any data and message provided.
 */
    #messageOperationSuccess(data, message = null) {
        return {
            success: true,
            data: data,
            message: message
        }
    }

    /**
     * Creates a standardized failure message object for API responses.
     * This function is used to indicate that an operation did not complete successfully, including a message about what went wrong.
     *
     * @param {Error|string} error - The error or string describing the failure encountered during the operation.
     * @returns {Object} Returns an object indicating the operation failed, containing an error message and null data.
     */
    #messageOperationFailure(error) {
        return {
            success: false,
            data: null,
            message: `An error has occurred: ${error}`
        };
    }


    /**
     * Sorts a list of traffic incidents in descending order based on their severity.
     * The severity is determined by a predefined sort order in the TravelIncidentsModel.SEVERITY_SORT_ORDER mapping.
     *
     * @param {Array} incidents - An array of incident objects, each expected to contain a 'magnitudeOfDelay' property used for sorting.
     */
    #sortIncidentsBySeverityDescending(incidents) {
        incidents.sort((a, b) => {
            const aSeverity = TravelIncidentsModel.SEVERITY_SORT_ORDER[a.magnitudeOfDelay];
            const bSeverity = TravelIncidentsModel.SEVERITY_SORT_ORDER[b.magnitudeOfDelay];
            return bSeverity - aSeverity;
        });
    }

    /**
     * Asynchronously retrieves and processes traffic incidents, returning the top five most severe incidents.
     * This method handles fetching data, transforming incident details, sorting them by severity, and slicing the array to only include the most critical incidents.
     *
     * @returns {Promise<Object>} A promise that resolves to a success message object containing the top incidents or a failure message object if an error occurs.
     */

    async getTravelIncidents() {
        try {
            const result = await this.fetchWithRetry();
            const incidents = result.incidents;

            let data = [];

            if (incidents) {

                for (const incident of incidents) {

                    let mappedIncident =
                    {
                        "iconCategory": TravelIncidentsModel.ICON_CATEGORY_MAP[incident.properties.iconCategory],
                        "magnitudeOfDelay": TravelIncidentsModel.MAGNITUDE_MAP[incident.properties.magnitudeOfDelay],
                        "from": incident.properties.from,
                        "to": incident.properties.to
                    }


                    data.push(mappedIncident);


                }

                this.#sortIncidentsBySeverityDescending(data);
                data = data.slice(0, 5); // Keep only the top 10 incidents

            }



            return this.#messageOperationSuccess(data)
        }
        catch (error) {
            return this.#messageOperationFailure(error);
        }
    }
}

module.exports = TravelIncidentsModel;
