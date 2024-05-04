/*
* written by: Tyler Anderson
* tested by: Team
* debugged by: Team
*/


const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/scheduleController');


/**
 * Handles POST requests to initiate a scheduling operation with specific concurrency and timing parameters.
 * This route sets up a scheduling task using user-provided configurations about maximum concurrent operations
 * and minimum time intervals between these operations.
 *
 * The route attempts to run the scheduling operation through a ScheduleController instance. If successful,
 * it responds with a JSON object indicating success and the result of the scheduling operation. If it fails,
 * it logs the error, and the client receives a 500 status code with an error message.
 */

router.post('/', async (req, res) => {
    const scheduleController = new ScheduleController();
    const maxConcurrent = req.body?.maxConcurrent ? req.body.maxConcurrent : 1;
    const minTime = req.body?.minTime ? req.body.minTime : 60000;
    const interval = 60

    try {

        const result = await scheduleController.run(interval, maxConcurrent, minTime);
        res.status(200).json({
            success: true,
            message: result

        });
    } catch (error) {
        console.error('Failed to initiate scheduling:', error);
        res.status(500).json({
            success: false,
            message: `Failed to initiate scheduling:\n ${error}`
        });
    }
});

module.exports = router;
