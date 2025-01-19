// emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const transporter = nodemailer.createTransport({
    service: process.env.MAIL_DOMAIN, 
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    }
});


export const sendNewPasswordEmail = (email, newPassword,userName) => {
    const mailOptions = {
      from: process.env.MAIL_AUTH_USER,
      to: email,
       subject: 'Your lms app New Password',
     html: '<p>HI '+userName+' your lms app New Password is '+newPassword+'</p>',
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  };

  