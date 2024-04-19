const Bottleneck = require("bottleneck");
const ScheduledTripsModel = require('../models/scheduledTripsModel');
const NotificationController = require('./notificationController');

/**
 * Controls the scheduling and processing of trips using a rate-limiting mechanism.
 * It utilizes a trip queue to manage and process trip notifications efficiently.
 * Example Usage:

 * async function runScheduler() {
 *   try {
 *     const scheduleController = new ScheduleController(30, 2, 5000);
 *     await scheduleController.getUpcomingTrips(); // Load trips into the queue
 *     const statusReport = await scheduleController.run(true); // Run the scheduling and get a report
 *     console.log('Scheduling Completed:', statusReport);
 *   } catch (error) {
 *     console.error('Error during scheduling operations:', error);
 *   }
 * }
 *
 * runScheduler();
 */
class ScheduleController {

    #tripQueue;
    #intervalMinutes;
    #currentDateTime;
    #scheduledTripsModel;
    #limiter;

    constructor(intervalMinutes = 60, maxConcurrent = 1, minTime = 3000) {
        this.#intervalMinutes = intervalMinutes;
        this.#currentDateTime = new Date();
        this.#scheduledTripsModel = new ScheduledTripsModel();
        this.#tripQueue = [];

        this.#limiter = new Bottleneck({
            maxConcurrent: maxConcurrent,
            minTime: minTime
        });

    }

    /**
    * Fetches upcoming trips and loads them into the trip queue.
    * @returns {Promise<Array>} A promise that resolves to the array of upcoming trips.
    */
    async #getUpcomingTrips() {

        this.#tripQueue = [];

        try {

            const queryResults = await this.#scheduledTripsModel.getUpcomingTrips(this.#currentDateTime, this.#intervalMinutes);
            this.#tripQueue = queryResults.data ? queryResults.data : [];

        }
        catch (error) {
            console.log(error);
        }

        return this.#tripQueue;

    }


    /**
     * Processes an individual trip to send notifications.
     * @param {Object} trip - The trip object to process.
     * @returns {Promise<Object>} A promise that resolves to the processed trip information.
     * @throws Will throw an error if the notification sending or status update fails.
     */
    async #processTrip(trip) {
        try {
            await this.#scheduledTripsModel.updateNotificationStatus(trip.trip_id, 'processing');
            const notificationController = new NotificationController(trip);
            await notificationController.sendMessage();
            await this.#scheduledTripsModel.updateNotificationStatus(trip.trip_id, 'sent');
            return { trip_id: trip.trip_id, time: new Date() };

        } catch (error) {
            console.error(`Error processing trip ${trip.trip_id}:`, error);
            await this.#scheduledTripsModel.updateNotificationStatus(trip.trip_id, 'failed');
            throw error;
        }
    }


    /**
     * Dispatches processing tasks for all trips in the queue.
     * @private
     * @returns {Promise<Array>} A promise that resolves when all trip processing tasks have settled.
     */
    async #dispatchTripProcessingTasks() {
        const notificationPromises = this.#tripQueue.map(trip => {
            return this.#limiter.schedule(() => this.#processTrip(trip));
        });
        return Promise.allSettled(notificationPromises);
    }

    /**
     * Processes the results of trip processing tasks and compiles a status report.
     * @param {Array} results - The results of the trip processing tasks.
     * @returns {Array} The status report for each trip processed.
     */
    #processResults(results) {
        const statusReport = [];
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                statusReport.push({
                    ...result.value,
                    status: 'sent',
                    error: null
                });
            } else if (result.status === 'rejected') {
                statusReport.push({
                    trip_id: this.#tripQueue[index].trip_id,
                    time: new Date(),
                    status: 'failed',
                    error: result.reason
                });
            }
        });
        return statusReport;
    }

    /**
     * Logs the status report to the console.
     * @param {Array} statusReport - The status report to log.
     * @returns {string} The compiled log string.
     */
    #logStatusReportToConsole(statusReport) {
        const logLines = [
            "=======================================================================================================",
            "\t\tScheduleController Process Log",
            "=======================================================================================================",
            `Start time: ${this.#currentDateTime}`,
            `Sending notifications for trips in the next ${this.#intervalMinutes} minutes`
        ];
        statusReport.forEach(element => {
            logLines.push(`time: ${element.time}\t trip_id: ${element.trip_id}\t status: ${element.status}\t error: ${element.error}`);
        });
        const log = logLines.join("\n");
        console.log(log);
        return log;
    }


    /**
     * Runs the process to dispatch and handle trip tasks, optionally producing and logging a status report.
     * This method is asynchronous and returns a Promise that either resolves to a string containing the status report 
     * if `produceStatusReport` is true and the operation is successful, or resolves to undefined if an error occurs.
     * 
     * @param {boolean} produceStatusReport - Whether to produce and log a status report.
     * @returns {Promise<string|undefined>} A promise that resolves with the status report of processed trips if `produceStatusReport` is true and no errors occur, otherwise undefined.
     */
    async run(produceStatusReport = true) {

        let statusReport;
        try {
            await this.#scheduledTripsModel.setAllProcessingTripsToFailed();
            await this.#getUpcomingTrips();
            const results = await this.#dispatchTripProcessingTasks();
            statusReport = this.#processResults(results);

            if (produceStatusReport) {
                this.#logStatusReportToConsole(statusReport);
            }


        } catch (error) {
            console.error("Error running scheduled trips:", error);
        }
        finally {
            await this.#scheduledTripsModel.close();

        }

        return statusReport;


    }




}

module.exports = ScheduleController;






