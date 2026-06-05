const nodemailer = require('nodemailer');

const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendBookingEmail = async (userEmail, userName, eventTitle, eventDate, eventTime, eventLocation) => {
    try{
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Event Booking Confirmation: ${eventTitle}`,
            html:`
            <h2> Hi ${userName},</h2>
            <p>Your bokking for <strong>${eventTitle}</strong> has been booked successfully.</p>
            <p>Thank you for choosing Enkai.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Booking email sent to: ${userEmail}`);
    }
    catch(error)
    {
        console.error(`Failed to send booking email to: ${userEmail}`);
    }
};

exports.sendOTPEmail = async (email, otp, type) => {
   try{

    const title = type === 'account verification' ? 'Account Verification for Enkai' : 'Event Booking Confirmation';
    const msg = type === 'account verification' ? 'Please verify your account by clicking the link below:' : 'Your event booking has been confirmed. Please check your booking details.';
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: title,
        html:`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #333;">${title}</h2>
            <p style="color: #666;">${msg}</p>
        </div>
        <div style="margin: 20px auto; padding:15px; text-align: center; background-color: #f0f0f0; border-radius: 5px;">
            OTP: ${otp}
        </div>
        <p style="color: #666; text-align: center;">This OTP is valid for 5 minutes.</p>
        `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to: ${email} for ${type}`);
   }
   catch(error)
   {
    console.error(`Failed to send OTP email to: ${email} for ${type}`);
   }
};
