const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}
module.exports = sendEmail;