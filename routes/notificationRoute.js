const express = require('express');
const router = express.Router();
const { notification } = require('../controllers/notificationController');

//Route to send notification
router.post('/', notification);

module.exports = router;
