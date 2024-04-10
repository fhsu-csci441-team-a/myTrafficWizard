const AddressModel = require('../../../models/addressModel');
require('dotenv').config();




describe('TC-3 AddressModel', () => {
    it('TC-3: A properly created api call is sent to TomTom', async () => {
        const apiKey = process.env.TOMTOM_API_KEY;
        const addressModel = new AddressModel(apiKey);
        const partialAddress = '123';

        const result = await addressModel.lookup(partialAddress);
        expect(result).toHaveProperty('addresses');
        expect(result.addresses).toBeInstanceOf(Array);
        expect(result.addresses.length).toBeGreaterThan(0);


        if (result.addresses.length > 0) {
            expect(result.addresses[0]).toHaveProperty('address');
            expect(result.addresses[0]).toHaveProperty('lat');
            expect(result.addresses[0]).toHaveProperty('lon');
        }
    }, 100000);

    it('TC-3: An improperly crafted api call is sent to TomTom', async () => {
        const apiKey = 'incorrect api key';
        const addressModel = new AddressModel(apiKey);
        const partialAddress = '123';
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const result = await addressModel.lookup(partialAddress);


        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();


    }, 100000);
});
