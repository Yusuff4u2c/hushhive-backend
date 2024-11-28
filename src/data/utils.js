const jwt = require("jsonwebtoken");
const jwt_simple = require("jwt-simple");
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user, duration = "15m") => {
  return jwt.sign(
    { id: user.id, username: user.username, tokenVersion: user.tokenVersion },
    JWT_SECRET,
    {
      expiresIn: duration,
    }
  );
};

const generateTokenSimple = (payLoad) => {
  const expiration = Math.floor(Date.now() / 1000) + 60 * 15;
  return jwt_simple.encode({ ...payLoad, expiration }, JWT_SECRET);
};

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  secure: process.env.MAILTRAP_PORT === 465 ? true : false,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const sendVerificationEmail = async (email, user) => {
  const token = generateTokenSimple({ id: user._id });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "HushHive Email Verification",
    html: `<h1>Welcome to HushHive</h1>
    <p>Click the link below to verify your email</p>
    <a href="https://api-hushhive.yemscript.com/auth/verify_email?token=${token}">Verify Email</a>`,
  };

  // <a href="http://localhost:3000/api/auth/verify_email?token=${token}">
  //   Verify Email
  // </a>;
  try {
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error.message);
        return { success: false, message: error.message };
      } else {
        console.log("Email sent: " + info.response);
        return { success: true, message: "Email sent" };
      }
    });
  } catch (error) {
    console.log(error.message);
    return { success: false, message: error.message };
  }
};

module.exports = {
  generateToken,
  generateTokenSimple,
  sendVerificationEmail,
};
