const express = require('express');
const stuController = require('../controllers/stuController');

const router = express.Router();

router.post('/login', stuController.login);
router.get('/data', stuController.getData);
// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);
module.exports = router;
