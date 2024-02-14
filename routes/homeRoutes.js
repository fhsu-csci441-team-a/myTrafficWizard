// routes for index/home page and homeController.js

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.index);
router.use('/static', homeController.static);

module.exports = router;