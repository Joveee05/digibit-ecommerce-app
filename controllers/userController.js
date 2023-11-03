const { signToken } = require('../config/jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

exports.createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.status(201).json({
      message: 'User Created',
      data: newUser,
    });
  } else {
    throw new Error('User already exists');
  }
});

exports.logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordCorrect(password))) {
    res.json({
      message: 'Logged in successfully',
      token: signToken(findUser?.id),
      data: findUser,
    });
  } else {
    throw new Error('Invalid login credentials');
  }
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find();

  if (allUsers.length < 1) {
    throw new Error('No users found in the database.');
  }
  res.status(200).json({
    status: 'success',
    message: `${allUsers.length} users found in the database`,
    allUsers: allUsers.length,
    data: allUsers,
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new Error('No user found with this ID');
  }
  res.status(200).json({
    status: 'success',
    message: 'user found',
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new Error('No user found with this ID');
  }

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new Error('No user found with this ID');
  }

  res.status(200).json({
    status: 'success',
    message: 'user update successful',
    data: user,
  });
});
