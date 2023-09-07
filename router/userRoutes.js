const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.creatUser);

router
  .route('/:id')
  .get(userController.getOneUser)
  .patch(userController.updatedUser);

router.route('/hhh/getSomeField').get(userController.getSomeUser);
module.exports = router;
