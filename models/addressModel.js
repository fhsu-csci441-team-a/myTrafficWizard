/**
 * The addressModel class retrieves a list of near matches to an address entered by a 
 * user. It uses the TomTom Search API to handle everything from exact street addresses,  
 * streets, or intersections as well as higher-level geographies such as city centers,
 * counties, states, etc.
 * This class encapsulates all interactions with the search API, providing a simple 
 * interface for the canonical single line search.
 * 
 * Usage Example:
 * const addressList = new addressModel("your_api_key_here");
 * const addresses = await addressList.lookup("partial_or_full_address_here");
 * 
 * Note:
 * This class requires a valid API key from TomTom and internet access to perform API requests.
 * It is designed to be used as part of larger applications where address search is needed.
 * 
 * Dependencies:
 * - None
 * 
 * Module Exports:
 * - addressModel class for external use.
 */

const fetch = require('node-fetch-npm');

class AddressModel {
    #address;
    #apiKey;
    static #versionNumber = 2; // Current TomTom API version in use

    /**
     * This constructor initializes the object with an API key for authentication to the TomTom Search API.
     * 
     * @param {string} apiKey The API key for authenticating requests to the search service.
     * 
     * Usage:
     * const addressModel = new AddressModel("your_api_key_here");
     * 
     */
    constructor(apiKey) {
        this.#apiKey = apiKey;
        this.#address = null;
    }

    /**
     * This function returns a list of addresses retrieved from a call to the TomTom Fuzzy 
     * Search API endpoint. It encapsulates the required functionality and returns the 
     * results as a JSON formatted list of addresses.
     * 
     * Example Return Values:
     * {
     *   "addresses": [
     *     {
     *       "address": "20 Chestnut Road, Webster Springs, WV 26288",
     *       "lat": 38.476749,
     *       "lon": -80.420664
     *     },
     *     {
     *       "address": "20 West 20th Street, Indianapolis, IN 46202",
     *       "lat": 39.793328,
     *       "lon": -86.157534
     *     }
     * }
     * 
     * @param {string} address A string containing part or all of the desired address to find.
     * @returns {Object} A JSON object comprising the list of addresses returned by the API
     * @throws {Error} An error is thrown if an unexpected error occurs.
     */
    async lookup(address) {
        // The TomTom API requires that the search query be properly URI Encoded
        this.#address = encodeURIComponent(address);

        const url = `https://api.tomtom.com/search/${AddressModel.#versionNumber}/search/
                    ${this.#address}.json
                    ?key=${this.#apiKey}`;

        console.log(url);
        try {
            let response = await fetch(url);

            // Response from fetch was successful (200-299), process response.
            if(response.ok) {
                let data = await response.json();
                const results = data.results;

                // Create the address list array and fill it with returned address information
                let addressList = [];
                results.forEach(result => {

                    // Push only the elements of the address that we want (address, lat, and lon)
                    addressList.push({ 'address': result.address.freeformAddress,
                                'lat': result.position.lat,
                                'lon': result.position.lon });
                });

                // Return the list of addresses as a JSON object
                return { 'addresses': addressList };
            }
            // Server side error: Log and return an empty address list
            else if (response.status >= 500) {
                console.log("AddressModel encountered a server error. Returned an empty Address List");
                return { 'addresses': [] };
            }

            // Rate limit exceeded: Log and return an empty address list.
            else if (response.status == 429) {
                console.log("Rate limit exceeded, AddressModel returned an empty Address List");
                return { 'addresses': [] };
            }
            // Throw an error if we get an unexpected unsuccessful response.
            else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        }
        // Some error not yet encountered has happened, send it to the error log
        catch(error) {
            console.error(`Encountered an error in addressModel: ${error.message}`);
        }
    }
}

module.exports = AddressModel;