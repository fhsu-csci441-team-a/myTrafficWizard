/**
 * A route to allow for direct testing of the API route used to call AddressModel
 * It allows for unit testing of AddressModel and may be extended without modifying
 * AddressModel or addressRoutes.
 */

require('dotenv').config();

// import express module and create router to define routes
const express = require('express');
const router = express.Router();

// import the AddressModel class
const AddressModel = require('../models/addressModel');

// create AddressModel object to handle address search
const addressModel = new AddressModel(process.env.TOMTOM_API_KEY);

/**
 * Define address search route for address URL ('/address')
 * This route accepts an address string as a variable :address.
 * @param {string} address accessed using the predefined req.params.address
 * @returns {Object} A JSON object comprising the list of addresses returned by addressModel.lookup
 */
router.get('/:address', async (req, res) => {
  // Log to the console the parameter passed to the address endpoint
  console.log(`testAddressModel: ${req.params.address}`);
  
    // In the unlikely chance our address string is less than 3 characters, send back
    // a message explaining that a search requires at least 3 characters.
    if(req.params.address.length < 3)
        return res.status(400)
                  .json({ 
                    'message': 'Please enter an address at least 3 characters in length.'
                  });

    // Address greater than 3 characters, get a list of near matching addresses.
    const data = await addressModel.lookup(req.params.address);
    res.json(data);
});

module.exports = router;