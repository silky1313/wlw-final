const express = require('express');
const stuController = require('../controllers/stuController');

const router = express.Router();
router.get('/data', stuController.getData);

//update
router.get('/update', stuController.updateData);

//delete+
router.get('/delete', stuController.deleteAll);

//router.route('/readme').get(stuController.getREADME);

module.exports = router;
