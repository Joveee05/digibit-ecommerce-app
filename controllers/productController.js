const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const { validateId } = require('../utils/validateId');
const slugify = require('slugify');
const { APIFeatures } = require('../utils/apiFeatures');

exports.createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

exports.getAllProducts = asyncHandler(async (req, res) => {
  const product = await APIFeatures(req);

  res.status(200).json({
    status: 'success',
    data: product,
  });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await validateId(id);
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('No Product found with this ID');
  }
  res.status(200).json({
    status: 'success',
    message: 'Product found',
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await validateId(id);
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new Error('No Product found with this ID');
  }

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully',
  });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await validateId(id);
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new Error('No Product found with this ID');
  }

  res.status(200).json({
    status: 'success',
    message: 'Product update successful',
    data: product,
  });
});
