const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/scheduleController');

const scheduleController = new ScheduleController();


router.post('/', async (req, res) => {
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
