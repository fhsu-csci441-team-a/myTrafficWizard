const BaseFetchRetry = require('./BaseFetchRetry');

class ReverseGeocode extends BaseFetchRetry {

    static HEADERS = { "Content-Type": "application/json" };

    constructor(apiKey) {


        super('', { method: "GET", headers: ReverseGeocode.HEADERS });
        this.apiKey = apiKey;
    }

    #setPoint(point, radius = 1000) {
        this.url = `https://api.tomtom.com/search/2/reverseGeocode/${point}.json?key=${this.apiKey}&radius=${radius}`;
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