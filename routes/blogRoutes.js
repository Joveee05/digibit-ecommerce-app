const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middlewares/auth');

router.use(auth.protect);

router.post('/create-blog', auth.isAdmin, blogController.createBlog);

router.get('/', auth.isAdmin, blogController.getAllBlogs);

router.get('/:id', auth.isAdmin, blogController.getBlog);

router.put('/update-blog/:id', auth.isAdmin, blogController.updateBlog);

module.exports = router;
