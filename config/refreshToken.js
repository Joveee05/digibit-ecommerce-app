const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  });

exports.sendAccessToken = async (user, res) => {
  const id = user._id;
  const refreshToken = generateRefreshToken(id);
  const updateUser = await User.findByIdAndUpdate(
    id,
    { refreshToken: refreshToken },
    { new: true }
  );
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('refreshToken', refreshToken, cookieOptions);
};

exports.clearToken = async (req) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error('No refresh Token in cookies');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
  }
  const updateUser = await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: '',
    }
  );
};
