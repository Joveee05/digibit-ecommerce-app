const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');

router.use(auth.protect);

router.post('/create-product', auth.isAdmin, productController.createProduct);

router.get('/', productController.getAllProducts);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(auth.isAdmin, productController.updateProduct)
  .delete(auth.isAdmin, productController.deleteProduct);

module.exports = router;
