const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.post('/register', userController.createUser);

router.get('/logout', userController.logOut);

router.post('/login', userController.logIn);

router.use(auth.protect);

router.get('/all_users', userController.getAllUsers);

router.get('/refresh', userController.handleRefreshToken);

router.patch('/reset-password', userController.updatePassword);

router.patch('/block-user/:id', auth.isAdmin, userController.blockUser);

router.patch('/unblock-user/:id', auth.isAdmin, userController.unblockUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
