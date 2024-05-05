/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

/**
 * The ReverseGeocode class extends the BaseFetchRetry class to provide functionality
 * for performing reverse geocoding operations using the TomTom API. This class handles
 * the construction of API requests for converting geographic coordinates into human-readable
 * addresses and managing retry logic for these requests.
 *
 * Example Usage:
 * --------------
 * const ReverseGeocode = require('./ReverseGeocode');
 * const apiKey = 'YOUR_TOMTOM_API_KEY';
 * const geocoder = new ReverseGeocode(apiKey);
 *
 * // Get the address for a specific location (latitude, longitude format)
 *  response = await geocoder.getAddress('52.509669,13.376294');
 *  console.log(response);
 *
 * // Specify a different radius
 * response = await geocoder.getAddress('52.509669,13.376294', 500);
 * console.log(response);
 * 
 * 
 */
const BaseFetchRetry = require('./BaseFetchRetry');

class ReverseGeocode extends BaseFetchRetry {

    static HEADERS = { "Content-Type": "application/json" };

    constructor(apiKey) {


        super('', { method: "GET", headers: ReverseGeocode.HEADERS });
        this.apiKey = apiKey;
    }

    /**
     * Configures the URL for reverse geocoding API requests, incorporating the geographic point and search radius.
     * This method constructs the URL needed to perform a reverse geocode lookup by setting the internal URL property.
     *
     * @param {string} point - A string representing the geographic coordinates in "latitude,longitude" format.
     * @param {number} [radius=1000] - The radius in meters around the point to consider for the geocoding results. Defaults to 1000 meters.
     */

    #setPoint(point, radius = 1000) {
        this.url = `https://api.tomtom.com/search/2/reverseGeocode/${point}.json?key=${this.apiKey}&radius=${radius}`;
    }

    /**
     * Constructs a standardized success message object for API responses.
     * This method is used to format responses when operations complete successfully, optionally including additional message context.
     *
     * @param {any} data - The data payload to be included in the success message, which can be of any type.
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
     * Constructs a standardized failure message object for API responses.
     * This method is used to format responses when operations fail, including a description of the error.
     *
     * @param {Error|string} error - The error encountered during the operation, which could be an Error object or a string describing the failure.
     * @returns {Object} Returns an object structured to indicate failure, containing no data and an error message.
     */

    #messageOperationFailure(error) {
        return {
            success: false,
            data: null,
            message: `An error has occurred: ${error}`
        };
    }


    /**
     * Asynchronously performs a reverse geocode operation to retrieve the address corresponding to a given geographic point.
     * This method handles setting up the request, executing it, and processing the response to extract the first available address.
     *
     * @param {string} point - A string representing the geographic coordinates in "latitude,longitude" format.
     * @param {number} [radius=1000] - Optional. The radius in meters around the point to consider for the geocoding results. Defaults to 1000 meters.
     * @returns {Promise<Object>} A promise that resolves to a success message object containing the address, or a failure object if an error occurs.
     */

    async getAddress(point, radius = 1000) {
        try {
            this.#setPoint(point, radius);
            const result = await this.fetchWithRetry();

            const addressesInProximity = result.addresses;
            const firstIndex = 0;
            const firstAddress = addressesInProximity[firstIndex];

            const data = firstAddress.address.freeformAddress;

            return this.#messageOperationSuccess(data);

        }
        catch (error) {
            return this.#messageOperationFailure(error);

        }

    }


}

module.exports = ReverseGeocode;
