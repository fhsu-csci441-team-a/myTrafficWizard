/**
 `BaseFetchRetry` provides a mechanism for making requests to web APIs with built-in retry logic.
 It is designed to handle transient network errors and specific HTTP status codes by automatically retrying requests.
 */

class BaseFetchRetry {
    #maxRetries = 5;
    #retryDelay = 1000;
    #url;
    #options;

    /**
    Constructs a new instance of the BaseFetchRetry class.
    This constructor initializes the instance with a specific URL and a set of options for the fetch request.
    The options object can include any valid fetch API options such as method, headers, body, etc.

    @param {string} url The URL to which the fetch request will be made. This should be a fully qualified URL string.
    @param {Object} options An object containing any custom settings that you want to apply to the request.
                             This can include headers, method, body, credentials, and other fetch API options.
                             See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch for a full list of options.
     */
    constructor(url, options) {
        this.#url = url;
        this.#options = options;
    }

    /**
    Executes a fetch request to the configured URL with the specified options. This method implements retry logic
    for handling transient network errors and specific HTTP status codes. If the request fails due to server errors (5xx) 
    or rate limiting (429), it will automatically retry up to a maximum number of attempts defined by `#maxRetries`. Between each retry, 
    it waits for a duration specified by `#retryDelay`.

    The method returns the JSON-parsed response of the fetch request if successful. For client errors (4xx) or
    other non-retryable server errors, it will throw an error immediately without retrying.

    @returns {Promise<Object>} The JSON-parsed response of the fetch request if the request is successful.
    @throws {Error} Throws an error if the request fails with a non-retryable error or if all retry attempts are exhausted.
     
    Usage example:
     const fetchRetry = new BaseFetchRetry('https://api.example.com/data', { method: 'GET' });
     fetchRetry.fetch()
     .then(data => console.log(data))
     .catch(error => console.error('Fetch error:', error));

    */
    async fetch() {

        for (let attempt = 1; attempt <= this.#maxRetries; attempt++) {
            try {
                let response = await fetch(this.#url, { ...this.#options });

                // Check if the response is successful (status 200-299).
                if (response.ok) {
                    return await response.json();
                }
                else {
                    console.log(`Attempt ${attempt} failed: Status ${response.status}`);

                    // Server side error: Log and prepare to retry after delay
                    if (response.status >= 500) {
                        console.log("Encountered a server error, will retry...");
                    }

                    // Rate limit exceeded: log and prepare to retry after delay.
                    else if (response.status == 429) {
                        console.log("Rate limit exceeded, will retry after delay");
                    }

                    else {
                        throw new Error(`Request failed with status ${response.status}`);
                    }
                }

            }
            catch (e) {
                console.error(`Attempt ${attempt} encountered an error: ${e.message}`);
                if (attempt >= this.#maxRetries || e.message.includes('Request failed with status')) {
                    throw e; // Rethrow the last error
                }

            }

            // If not the last attempt, log the retry delay and wait before retrying.
            if (attempt < this.#maxRetries) {
                console.log(`Retrying in ${this.#retryDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, this.#retryDelay));
            }
        }


    }



}

module.exports = BaseFetchRetry;