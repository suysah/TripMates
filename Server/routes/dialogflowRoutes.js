const express = require('express');
const router = express.Router();
const dialogflowController = require('../controllers/dialogflowController');
router.options('*', cors());

// POST /api/webhook
router.post('/', dialogflowController.dialogflowWebhook);

module.exports = router;
