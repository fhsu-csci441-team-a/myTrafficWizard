
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


    isNetworkOrServerError(statusCode) {
        return statusCode === 429 || statusCode >= 500;
    }

    delay(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

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
