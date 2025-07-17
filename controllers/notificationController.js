const { sendEmail } = require('../utils/sendEmail');
const { validateEmail } = require('../middleware/validateEmail');

exports.notification = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(403).json({
        success: false,
        message: 'All message fields are required',
      });
    }

   await validateEmail(email);

    const messageToAdmin = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #007bff;">Message From Portfolio Website</h2>
                <p>Message from: ${name},</p>
                <p>Email: ${email}</p>
                <h2 style="color: #007bff;">Message</h2>
                <p> ${message} </p>
    </div>
    `;
    const messageToClient = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #007bff;">Mail received</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to Joseph Mensah.
        Your message has been received and I appreciate your interest.
        I will review your message and get back to you as soon as possible.</p>
        <p>If you have any urgent questions, feel free to reply to this email.</p>
        <div style="margin: 24px 0;">
        <a href="https://wa.me/233256269405" target="_blank" style="display: inline-block; background-color: #25D366; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1022px-WhatsApp.svg.png" alt="WhatsApp" style="vertical-align: middle; width: 24px; height: 24px; margin-right: 8px;">
            WhatsApp Me
        </a>
        </div>
        <p>Best regards,</p>
        <p><strong>Joseph Mensah</strong></p>
    </div>
    `;

    sendEmail(process.env.GMAIL_USER, 'Portfolio Message', messageToAdmin);
    sendEmail(email, 'Mail Received', messageToClient);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully.',
    });
  } catch (error) {
    console.log(error.stack);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
