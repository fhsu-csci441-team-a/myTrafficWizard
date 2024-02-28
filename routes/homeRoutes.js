// routes for index/home page and homeController.js

const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/homeController');

// create HomeController object
const homeController = new HomeController();

router.get('/', (req, res) => homeController.index(req, res));
router.use('/static', (req, res, next) => homeController.static(req, res, next));

module.exports = router;