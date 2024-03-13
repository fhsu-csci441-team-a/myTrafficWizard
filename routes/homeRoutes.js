// routes for index/home page and homeController.js

// import express module and create router to define routes
const express = require('express');
const router = express.Router();

// import the HomeController class
const HomeController = require('../controllers/homeController');

// create HomeController object to handle home page and static requests
const homeController = new HomeController();

// define home page (index) route for root URL ('/')
router.get('/', (req, res) => homeController.serveIndex(req, res));

// define static file route for /static folder
router.use('/static', (req, res, next) => homeController.serveStatic(req, res, next));

// export the router object to allow other modules to use routes
module.exports = router;