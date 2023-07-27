const express = require('express');
const testController = require('../controllers/testController');

const router = express.Router();

router
  .route('/')
  .get(testController.getAllTests)
  .post(testController.createTest);

module.exports = router;
