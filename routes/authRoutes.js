const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.post('/register', userController.createUser);

router.post('/login', userController.logIn);

router.use(auth.protect);

router.get('/all_users', userController.getAllUsers);

router.get('/:id', userController.getUser);

router.patch('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

router.patch('/block-user/:id', auth.isAdmin, userController.blockUser);

router.patch('/unblock-user/:id', auth.isAdmin, userController.unblockUser);

module.exports = router;
