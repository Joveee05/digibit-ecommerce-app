const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

exports.sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: 'Digitic <info@digitic.com>',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });
});
