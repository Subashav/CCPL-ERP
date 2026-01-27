import nodemailer from 'nodemailer';

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({ success: true, token });
};

const sendEmail = async (options) => {
    // Create a transporter
    // For dev, often use Mailtrap or Ethereal, or Gmail if env vars provided
    // Here using a generic setup that expects env vars
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
