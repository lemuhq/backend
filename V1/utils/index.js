import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "../models/Users.js";
import CryptoJS from 'crypto-js';
import QRCode from 'qrcode'
import pkg from 'jsonwebtoken';
import ejs from 'ejs'
import path from 'path';
const __dirname = path.resolve();
 
import dotenv from 'dotenv';
dotenv.config();

const passcode = process.env.ENCRYPTION_KEY;


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


// //send welcome email
// export const waitlistEmail = async (email, fullName) => {
//     console.log("email here",email)
//     const transporter = nodemailer.createTransport({
//         // host: 'gmail',
//         // port: 465,
//         //   secure: true, // true for 465, false for other ports
//         service:'gmail',
//         auth: {
//             // user: 'support@lemu.africa', // generated ethereal user
//             // pass: 'password_support@lemu.africa' // generated ethereal password
//             user:'lemuhq@gmail.com',
//             pass:process.env.APPPASS
//         },
//         // tls: {
//         //     rejectUnauthorized: false
//         // }

//     });

//     const mailOptions = {
//         from: 'Lemu',
//         to: email,
//         subject: 'Thank you for Joining our wait list',
//         html: `
//         Hello ${fullName},<br>

//         Welcome to Lemu, your gateway to seamless online and offline payments! We're thrilled to have you on board and eager
//         to share our innovative fintech solutions with you. 🚀.<br><br>

//         At Lemu, we're committed to revolutionizing the way you handle transactions. 
//         With our upcoming product, you'll have the power to accept and make payments 
//         effortlessly, whether you're online or offline. Our unique Lemu Orange Card will enable
//          you to make secure transactions in-person, while our user-friendly mobile app will streamline your online 
//          payment experience.<br><br>

        

//           By joining our waitlist, you're taking the first step towards unlocking access 
//           to these groundbreaking features before anyone else. As a valued member of our community,
//            you'll receive exclusive updates, sneak peeks, and early access to our platform once it's
//            ready for launch. 🌟<br><br>

//            But that's not all – by signing up now, you'll also have the opportunity to
//             shape the future of Lemu. We value your feedback and
//             insights, and we're eager to hear your thoughts as we continue to develop and refine our product.<br><br>

//          <b>What's more?</b><br>

//          We have a 24-hour customer service policy [you all are our trophy]. So, I’m handing you<br> over to Lemuaid.
//          She’ll be your personal account officer. Feel free to contact us anytime <br>you feel like talking.<br><br>

//          Thank you for your interest in Lemu.<br><br>
//          Follow us on social media: Instagram, Twitter and Facebook @lemuHQ<br><br>

//          Best regards,<br>
//             <b>Uhembe Nelson</b><br>
//             <b>Founder Lume</b>
        
//         `
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }

export  const waitlistEmail = async (email, fullName)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:'lemuhq@gmail.com',
            pass:'dircpvmdzlpvbvph'
        }
    })
    
    async function sendEmail(to, subject, template, data) {
        try {
            const html = await ejs.renderFile(__dirname + '/views/' + template + '.ejs', data, { async: true })
    
            const mailOptions = {
                from: 'Lemu',
                to,
                subject,
                html
            }
    
            await transporter.sendMail(mailOptions)  
            
            console.log('Message sent successfully!')
        } catch (err) {
            console.log('Error: ', err)
        }
    }
    
    sendEmail(email, 'Thank you for Joining our wait list', 'waitlistEmail', { userName: fullName })
}


export const encryptData = async(objectToEncrypt)=>{
    try {
        const textToEncrypt = JSON.stringify(objectToEncrypt);
        const encrypted = CryptoJS.AES.encrypt(textToEncrypt, passcode).toString();

        return encrypted;
    } catch (error) {
        console.error('Encryption failed:', error);
        return null;
    }

}


export const decryptData = async(encryptedText)=>{
    try{
        const bytes = CryptoJS.AES.decrypt(encryptedText,passcode)
        if(bytes.sigBytes > 0){
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          return  decryptedData
      }else{
          throw new Error('Decrytion failed')
      }

    }catch(err){
        throw new Error('Decrytion failed', err)
    }   

}



export const generateQR = async (encryptedText) => {
    try {
      const response = await QRCode.toDataURL(encryptedText, {
        color: {
          dark: '#C9CACD', // Blue dots
          light: '#292D32' // Transparent background
        }
      });
  
      const data = new FormData();
      data.append('file', response);
      data.append('upload_preset', 'Qrcode');
  
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDNAME}/image/upload`,
        {
          method: 'POST',
          body: data
        }
      );
  
      const uploadData = await uploadResponse.json();
  
    //   console.log('Upload successful', uploadData.url);
      return uploadData.url;
    } catch (err) {
      console.error(err);
    }
  };


  export const login = async ( res, req) =>{
    console.log("working here", req.body)
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.passwoord
    try {
      //check if user with email already exists
      const userExists = await User.findOne({phoneNumber});
      if (!userExists) {
          return res.status(404).send({ msg: "User does not exist" });
      }
      //check if password is correct
      const passwordCorrect = await PasswordCorrect(password, userExists);
      if (passwordCorrect) {
          const user = {
             data: userExists
          }
          const accessToken = jwt.sign({ user: user }, 'mayorgnn@088',
          {
              expiresIn: '1h'
          });
          return res.status(200).send({
              message: "Login Successful",
              status:true,
              accessToken,
             // data:user
          })
      }
      if (!passwordCorrect) {
          return res.status(404).send({ msg: "Password is incorrect" });
      }
  } catch (error) {
      res.status(400).send(error);
  }
  }

  export const sendSms = async (data) =>{

    

    const  number = data.phoneNumber;
    const body = data.message
    const from = "Lemu";
    const api_token = "Nf1cjArMemxQjbu7O5uby6e8GPI4Gl4z9CoByBKzJJgRabb5d3VbQgAQCubU";

    var url = `https://www.bulksmsnigeria.com/api/v1/sms/create?api_token=${api_token}&from=${from}&to=${number}&body=${body}&dnd=2`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
    console.log(data)
    return true
    })
    .catch(err => {
        console.log(err);
        throw new Error('could not send Sms')
    })

}