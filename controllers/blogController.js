const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

exports.createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);

    res.status(201).json({
      status: 'success',
      data: newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

exports.updateBlog = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: 'success',
      data: blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

exports.getAllBlogs = asyncHandler(async (req, res) => {
  const allBlogs = await Blog.find();

  if (allBlogs.length < 1) {
    throw new Error('No blogs found in the database.');
  }
  res.status(200).json({
    status: 'success',
    message: `${allBlogs.length} blogs(s) found`,
    allBlogs: allBlogs.length,
    data: allBlogs,
  });
});

exports.getBlog = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const findBlog = await Blog.findById(id);
  if (!findBlog) {
    throw new Error('No blog found with this ID');
  }
  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { numViews: 1 } },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
    message: 'Blog found',
    data: blog,
  });
});
