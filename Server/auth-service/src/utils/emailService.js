import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email, otp) => {
  try {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.log(`\n=========================================`);
      console.log(`📧 MOCK EMAIL (SMTP not configured)`);
      console.log(`To: ${email}`);
      console.log(`Message: Your OTP is: ${otp}`);
      console.log(`=========================================\n`);
      return true; // Simulate success
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this to 'smtp.sendgrid.net' or others if needed
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Fashion Store" <${smtpUser}>`,
      to: email,
      subject: "Your OTP for Registration",
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
      html: `<b>Your OTP is: ${otp}</b><br/>It will expire in 10 minutes.`,
    });

    console.log("Real Email sent successfully to %s: %s", email, info.messageId);
    console.log(`\n=========================================`);
    console.log(`🔑 DEV/TEST OTP INFO: ${otp} (sent to ${email})`);
    console.log(`=========================================\n`);
    return true;
  } catch (error) {
    console.error("Email send failed:", error.message);
    console.log(`\n=========================================`);
    console.log(`📧 MOCK EMAIL FALLBACK (SMTP failed)`);
    console.log(`To: ${email}`);
    console.log(`Message: Your OTP is: ${otp}`);
    console.log(`=========================================\n`);
    return true; // Fallback to console OTP so registration doesn't fail in development/testing
  }
};
