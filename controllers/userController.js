const { sendAccessToken, clearToken } = require('../config/refreshToken');
const { signToken } = require('../config/jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { validateId } = require('../utils/validateId');
const jwt = require('jsonwebtoken');

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
    await sendAccessToken(findUser, res);
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
    message: `${allUsers.length} user(s) found in the database`,
    allUsers: allUsers.length,
    data: allUsers,
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateId(id);
  const user = await User.findById(id);
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
  const { id } = req.user;
  validateId(id);
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new Error('No user found with this ID');
  }

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  validateId(id);
  const user = await User.findByIdAndUpdate(id, req.body, {
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

exports.blockUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.status(200).json({ message: 'User blocked' });
  } catch (error) {
    throw new Error(error);
  }
});

exports.unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.status(200).json({ message: 'User unblocked' });
  } catch (error) {
    throw new Error(error);
  }
});

exports.handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error('No refresh Token in cookies');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error('No refresh token in database');
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error('Something went wrong with refresh token');
    }
    const accessToken = signToken(user.id);
    res.json({ accessToken });
  });
});

exports.logOut = asyncHandler(async (req, res) => {
  await clearToken(req);
  res.clearCookie('refreshToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'You have been logged out successfully',
  });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const password = req.body.password;
  await validateId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const userPassword = await user.save();
    res.status(200).json({
      status: 'success',
      data: userPassword,
    });
  } else {
    res.json(user);
  }
});
