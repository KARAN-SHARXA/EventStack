const nodeMailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
}); 

exports.sendOTPEmail = async (useremail, otp , type) => {
try{

  const title = type === 'account_verification' ? 'Verify your Eventora Account' : 'Event Booking website';
  const msg = type === 'account_verification' ? `please use the following OTP to verify your account on EventStack: ${otp}. It will expire in 5 minutes.` : `please use the following OTP to confirm your event booking on EventStack: ${otp}. It will expire in 5 minutes. `;
  const mailOptions = {
  from: process.env.EMAIL_USER,
  to: useremail,
  subject: title,
  html: `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
      
      <div style="max-width:500px; margin:auto; background:white; padding:20px; border-radius:10px; text-align:center;">
        
        <h2 style="color:#333;">EventStack</h2>
        
        <p style="font-size:16px; color:#555;">
          Use the OTP below to ${msg}:
        </p>
        
        <div style="font-size:28px; font-weight:bold; letter-spacing:5px; margin:20px 0; color:#2c3e50;">
          ${otp}
        </div>
        
        <p style="color:#888; font-size:14px;">
          This OTP will expire in 5 minutes.
        </p>
        
        <hr style="margin:20px 0;">
        
        <p style="font-size:12px; color:#aaa;">
          If you didn’t request this, you can safely ignore this email.
        </p>

      </div>
    </div>
  `
};
  await transporter.sendMail(mailOptions);
}catch(error){
  console.error('Error sending OTP email:', error);
}
    
};