/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/

const databaseConnection = require('../config/databaseConnection');
require('dotenv').config();

/**
 * Represents the model for scheduled trips, providing functionality to create,
 * retrieve, and manage scheduled trip records in the database.
 * 
 * This class handles database interactions related to trips, such as creating new trips,
 * fetching trips, and closing the database connection.
 *
 * const ScheduledTripsModel = require('./ScheduledTripsModel');
 * const tripsModel = new ScheduledTripsModel();
 *
 * // Create a new trip
 * const tripDetails = {
 *   email_address: 'user@gmail.com',
 *   departure_latitude: '40.712776',
 *   departure_longitude: '-74.005974',
 *   destination_latitude: '34.052235',
 *   destination_longitude: '-118.243683',
 *   departure_date: new Date('2023-10-10T10:00:00Z'),
 *   mobile_number: '1234567890',
 *   mobile_provider: 'Provider 1',
 *   user_id_discord: 'discord123',
 *   user_id_slack: 'slack456',
 *   notification_status: null
 * };
 *
 * async function createTrip() {
 *   const result = await tripsModel.createTrip(tripDetails);
 *   console.log(result);
 * }
 *
 * createTrip();
 */

class ScheduledTripsModel {

    #connection;


    constructor(table = 'scheduled_trips') {

        const user = process.env.DB_USER;
        const host = process.env.DB_HOST;
        const database = process.env.DB_NAME;
        const password = process.env.DB_PASSWORD;
        const port = process.env.DB_PORT;
        const connectionString = `postgres://${user}:${password}@${host}:${port}/${database}?ssl=true`;

        this.#connection = new databaseConnection(connectionString);
        this.table = table;

    }



    /**
     * Constructs a success message object typically used to respond to successful operations.
     *
     * @param {any} data - The data payload associated with the success message, can be any type.
     * @param {string} [message=null] - An optional message describing the success; defaults to null if not provided.
     * @returns {Object} An object with a success status, data payload, and a message.
     */
    #messageOperationSuccess(data, message = null) {
        return {
            success: true,
            data: data,
            message: message
        }
    }

    /**
     * Constructs a failure message object typically used to respond to failed operations.
     *
     * @param {Error|string} error - An error object or string describing what went wrong.
     * @returns {Object} An object indicating failure, with no data and an error message.
     */
    #messageOperationFailure(error) {
        return {
            success: false,
            data: null,
            message: `An error has occurred: ${error}`
        };
    }


    /**
     * Unpacks trip details from an object into a flat array format.
     *
     * @param {Object} trip_details - An object containing various elements of trip details such as email address,
     *                                departure and destination coordinates, dates, and user contact information.
     * @returns {Array} An array containing the values of specified trip details, ordered according to the method's implementation.
     */
    #unpackTripDetailsIntoArray(trip_details) {
        return [
            trip_details.email_address,
            trip_details.departure_latitude,
            trip_details.departure_longitude,
            trip_details.destination_latitude,
            trip_details.destination_longitude,
            trip_details.departure_date,
            trip_details.mobile_number,
            trip_details.mobile_provider,
            trip_details.user_id_discord,
            trip_details.user_id_slack,
            trip_details.notification_status
        ]

    }

    /**
     * Sets the internal 'table' property of the instance, typically used to specify which database table to interact with.
     *
     * @param {string} table - The name of the table to be set for subsequent operations.
     */
    setTable(table) {
        this.table = table;
    }

    /**
    * Creates a new trip in the database with the given details.
    * @param {Object} tripDetails - The details of the trip to create.
    * @returns {Promise<Object>} A success message with the created trip's ID, or an error message.
    */
    async createTrip(trip_details) {
        const query = `
        insert into ${this.table}
        (
            email_address, 
            departure_latitude, 
            departure_longitude, 
            destination_latitude, 
            destination_longitude, 
            departure_date, 
            mobile_number, 
            mobile_provider, 
            user_id_discord, 
            user_id_slack, 
            notification_status
        ) 
        VALUES 
        (
            $1, 
            $2, 
            $3, 
            $4, 
            $5, 
            $6, 
            $7, 
            $8, 
            $9, 
            $10, 
            $11
        )

        RETURNING trip_id;
        `;

        const params = this.#unpackTripDetailsIntoArray(trip_details);

        try {
            const queryResultRows = await this.#connection.query(query, params);
            const queryReturnedTripId = queryResultRows[0].trip_id;
            const returnMessage = `Trip created with ID: ${queryReturnedTripId}`
            return this.#messageOperationSuccess(queryReturnedTripId, returnMessage);
        }
        catch (error) {
            return this.#messageOperationFailure(error);
        }

    }


    /**
     * Retrieves all trips from the database.
     * @returns {Promise<Object>} An array of all trips or an error message.
     */
    async getAllTrips() {
        const query = `
        select 
        * 
        from ${this.table}
        `;

        try {
            const queryResultRows = await this.#connection.query(query);
            return this.#messageOperationSuccess(queryResultRows);
        }
        catch (error) {
            return this.#messageOperationFailure(error);
        }
    }


    /**
    * Retrieves a specific trip by its tripID.
    * @param {number} id - The ID of the trip to retrieve.
    * @returns {Promise<Object>} The trip details or an error message.
    */
    async getTripsById(id) {
        const query = `
        select 
        * 
        from ${this.table} 
        where trip_id = $1`;

        const queryParams = [id]

        try {
            const queryResultRows = await this.#connection.query(query, queryParams);
            return this.#messageOperationSuccess(queryResultRows);
        }
        catch (error) {
            return this.#messageOperationFailure(error);
        }
    }


    /**
    * Retrieves trips that are upcoming within a specified time interval.
    * @param {Date} inputDate - The start date for finding upcoming trips.
    * @param {number} offsetMinutes - The time offset in minutes to find trips that are upcoming.
    * @returns {Promise<Object>} An array of upcoming trips or an error message.
    */
    async getUpcomingTrips(inputDate, offsetMinutes) {

        inputDate = inputDate.toISOString();

        const query = `
        select * 
        from ${this.table} 
        where (departure_date between $1 and  $1::timestamp + ($2::text || ' minutes')::interval) and
        (notification_status is null or notification_status = 'failed')
        `;


        const queryParams = [inputDate, offsetMinutes];

        try {
            const queryResultRows = await this.#connection.query(query, queryParams);

            return this.#messageOperationSuccess(queryResultRows);
        }
        catch (error) {
            return this.#messageOperationFailure(error);
        }

    }

    /**
    * Updates the notification status for a specific trip.
    * @param {number} id - The ID of the trip to update.
    * @param {string} status - New notification status
    * @returns {Promise<Object>} The updated trip or an error message.
    */
    async updateNotificationStatus(id, status) {
        const query = `
        update ${this.table} 
        set notification_status = $2
        where trip_id = $1
        RETURNING *;
        `;

        const queryParams = [id, status]

        try {
            const queryResultRows = await this.#connection.query(query, queryParams);
            if (queryResultRows.length === 0) {
                throw new Error(`Trip with ID ${id} not found.`);
            }
            return this.#messageOperationSuccess(queryResultRows);
        }
        catch (error) {
            return this.#messageOperationFailure(error);
        }
    }

    /**
  * Deletes the specified trip from the database.
  * @param {number} id - The ID of the trip to delete.
  * @returns {Promise<Object>} The successful delete message or an error message.
  */
    async deleteTripById(id) {
        const query = `
        delete 
        from
        ${this.table} 
        where trip_id = $1
        
        `;

        const queryParams = [id]

        try {
            const queryResultRows = await this.#connection.query(query, queryParams);
            return this.#messageOperationSuccess(null);
        }
        catch (error) {
            return this.#messageOperationFailure(error);
        }
    }


    /**
* Updates the notification status for all trps processing to failed.
* @returns {Promise<Object>} The successful update message or an error message.
*/
    async setAllProcessingTripsToFailed() {
        const query = `
        
        update ${this.table} 
        set notification_status = 'failed'
        where notification_status = 'processing'
        `;


        try {
            const queryResultRows = await this.#connection.query(query);
            return this.#messageOperationSuccess(null);
        }
        catch (error) {
            return this.#messageOperationFailure(error);
        }
    }



    /**
     * Closes the database connection.
     */
    async close() {
        await this.#connection.close();
    }



}

module.exports = ScheduledTripsModel;
