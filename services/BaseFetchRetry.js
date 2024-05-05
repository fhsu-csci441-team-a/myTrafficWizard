/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/


/**
 * Executes web API requests with retry logic on transient errors and rate limits.
 * 
 * This class automates the process of retrying failed fetch requests due to server errors (5xx)
 * and rate limiting (429), with a configurable number of retries and delay between retries.
 * 
 *  * Example Usage:
 * 
 * ```javascript
 * const fetchRetry = new BaseFetchRetry('https://api.example.com/data', {
 *   method: 'GET',
 *   headers: { 'Accept': 'application/json' }
 * });
 * 
 * fetchRetry.fetchWithRetry()
 *   .then(data => console.log('Fetched data:', data))
 *   .catch(error => console.error('Fetch error:', error));
 * ```
 * 
 */

class BaseFetchRetry {

    constructor(url, options) {
        this.url = url;
        this.options = options;
        this.maxRetries = 5;
        this.retryDelayMilliseconds = 1000;
    }

    /**
     * Determines whether a given HTTP status code represents a network error or a server-side error that justifies retrying a request.
     * This function checks for status codes typical of network issues (429 Too Many Requests) or server errors (500 and above).
     *
     * @param {number} statusCode - The HTTP status code received from a request.
     * @returns {boolean} True if the status code is 429, 500, or higher, indicating a retryable error; otherwise, false.
     */

    isNetworkOrServerError(statusCode) {
        return statusCode === 429 || statusCode >= 500;
    }

    /**
     * Creates a promise that resolves after a specified number of milliseconds, effectively pausing execution.
     * This utility is typically used to introduce a delay in loops or between retries in asynchronous operations.
     *
     * @param {number} milliseconds - The number of milliseconds to delay.
     * @returns {Promise<void>} A promise that resolves after the specified delay, used to pause asynchronous functions.
     */
    delay(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    /**
     * Attempts to fetch data from a specified URL with retries, adhering to a retry policy based on response status codes.
     * This method uses exponential backoff or fixed delays between retries and will retry if encountering network or server errors.
     * 
     * @async
     * @returns {Promise<Object>} The JSON-parsed response from the fetch call if successful.
     * @throws {Error} Throws an error if the request fails permanently after the maximum allowed retries or due to client-side errors.
     * 
     * The method keeps track of attempts and will throw an error if the maximum number of retries is reached without a successful response.
     * Network or server errors (response status 429 or 500+) trigger a retry after a delay specified by `this.retryDelayMilliseconds`.
     */
    async fetchWithRetry() {
        let attempt = 0;
        while (attempt < this.maxRetries) {

            const response = await fetch(this.url, this.options);

            if (response.ok) {
                return await response.json();
            }

            if (!this.isNetworkOrServerError(response.status)) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            console.log(`Retrying due to ${response.status} status after attempt ${attempt + 1}`);
            await this.delay(this.retryDelayMilliseconds);
            attempt++;
        }

        throw new Error(`Failed after ${this.maxRetries} retries without success.`);
    }

}


module.exports = BaseFetchRetry;
