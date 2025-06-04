const express = require('express');
const router = express.Router();
const dialogflowController = require('../controllers/dialogflowController');

// POST /api/webhook
router.post('/', dialogflowController.dialogflowWebhook);

module.exports = router;
