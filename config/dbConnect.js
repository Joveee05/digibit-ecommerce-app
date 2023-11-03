const { default: mongoose } = require('mongoose');
const dotenv = require('dotenv').config();
const DB = process.env.DATABASE;
const dbConnect = () => {
  try {
    const conn = mongoose.connect(DB);
    console.log('Database connected succesfully');
  } catch (err) {
    console.error('Message', err);
  }
};

module.exports = dbConnect;
