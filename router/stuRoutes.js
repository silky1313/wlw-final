const express = require('express');
const stuController = require('../controllers/stuController');

const router = express.Router();

router.get('/data', stuController.getData);
router.get('/update', stuController.updateData);

module.exports = router;
