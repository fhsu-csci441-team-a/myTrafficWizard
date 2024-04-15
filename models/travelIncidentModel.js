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


    #sortIncidentsBySeverityDescending(incidents) {
        incidents.sort((a, b) => {
            const aSeverity = TravelIncidentsModel.SEVERITY_SORT_ORDER[a.magnitudeOfDelay];
            const bSeverity = TravelIncidentsModel.SEVERITY_SORT_ORDER[b.magnitudeOfDelay];
            return bSeverity - aSeverity;
        });
    }


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
