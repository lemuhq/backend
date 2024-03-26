import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import User from "../models/Users.js";




//hash password
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
//check if password is correct
export const PasswordCorrect = async (password, userExists) => {
    const passwordCorrect = await bcrypt.compare(password, userExists.password);
    return passwordCorrect;
}


//send welcome email
export const waitlistEmail = async (email) => {
    console.log("email here",email)
    const transporter = nodemailer.createTransport({
        host: 'mail.lemu.africa',
        port: 465,
          secure: true, // true for 465, false for other ports
        auth: {
            user: 'support@lemu.africa', // generated ethereal user
            pass: 'password_support@lemu.africa' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
      


    });

    const mailOptions = {
        from: '<support@lemu.africa>',
        to: email,
        subject: 'Thank you for Joining our wait list',
        html: `
        Hello dear,<br>

        Welcome to Lemu, your gateway to seamless online and offline payments! We're thrilled to have you on board and eager
        to share our innovative fintech solutions with you. 🚀.<br><br>

        At Lemu, we're committed to revolutionizing the way you handle transactions. 
        With our upcoming product, you'll have the power to accept and make payments 
        effortlessly, whether you're online or offline. Our unique Lemu Orange Card will enable
         you to make secure transactions in-person, while our user-friendly mobile app will streamline your online 
         payment experience.<br><br>

        

          By joining our waitlist, you're taking the first step towards unlocking access 
          to these groundbreaking features before anyone else. As a valued member of our community,
           you'll receive exclusive updates, sneak peeks, and early access to our platform once it's
           ready for launch. 🌟<br><br>

           But that's not all – by signing up now, you'll also have the opportunity to
            shape the future of Lemu. We value your feedback and
            insights, and we're eager to hear your thoughts as we continue to develop and refine our product.<br><br>

         <b>What's more?</b><br>

         We have a 24-hour customer service policy [you all are our trophy]. So, I’m handing you<br> over to Lemuaid.
         She’ll be your personal account officer. Feel free to contact us anytime <br>you feel like talking.<br><br>

         Thank you for your interest in Lemu.<br><br>
         Follow us on social media: Instagram, Twitter and Facebook @lemuHQ<br><br>

         Best regards,<br>
            <b>Uhembe Nelson</b><br>
            <b>Founder Lume</b>
        
        `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}