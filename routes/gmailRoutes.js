// routes for Gmail functions through gmailController.js

const express = require('express');
const router = express.Router();
const gmailController = require('../controllers/gmailController');

router.post('/send', gmailController.sendEmail);

module.exports = router;