import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, username, verifyToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Task Manager" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email address",
      html: `
        <h2>Hello ${username},</h2>
        <p>Thanks for signing up! Please click the link below to verify your email:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify/${verifyToken}" target="_blank">
          Verify Email
        </a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(" Email sent: " + info.response);
  } catch (error) {
    console.error(" Email sending failed:", error);
  }
};
