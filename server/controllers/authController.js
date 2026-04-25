const User = require("../models/User");
const { sendOTPEmail } = require("../utils/email");
const bcrypt = require("bcryptjs");
const OTP = require("../models/OTP");
const jwt = require('jsonwebtoken');
const generateToken = (id,role)=>{
  return jwt.sign({id,role}, process.env.JWT_SECRET, {expiresIn: '7d'});
}

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  let userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`OTP for ${email} : {otp}`);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roler: "user",
      isVerified: false,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${email} : ${otp}`);
    await sendOTPEmail(email, otp, "account_verification");

    await OTP.create({ email, otp, action: "account_verification" });
    await sendOTPEmail(email, otp, "account_verification");

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for the OTP to verify your account.",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Please sign up first" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (!user.isVerified && user.role === "user") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteOne({ email, action: "account_verification" });
    await OTP.create({ email, otp, action: "account_verification" });
    await sendOTPEmail(email, otp, "account_verification");
    return res.status(400).json({
      error: "Account not verified. A new OTP has been sent to your email.",
    });
  }

  res.json({
    message: "Login successful",
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role)
  });
};


//Verify OTP for account verification
exports.verifyotp = async (req, res) => {
  const { email, otp } = req.body;
  const otpRecord = await OTP.findOne({ email, otp, action: "account_verification" });
  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
  await OTP.deleteOne({ email, action: "account_verification" });

  res.json({ 
    message: "Account verified successfully , you can now login.",
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role)
  });
};