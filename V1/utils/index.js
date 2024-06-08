import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "../models/Users.js";
import CryptoJS from 'crypto-js';
import QRCode from 'qrcode'
import pkg from 'jsonwebtoken';
import ejs from 'ejs'
import path from 'path';
const __dirname = path.resolve();
import { v2 as cloudinary } from 'cloudinary'
import Transaction from "../models/Transaction.js";
import admin from 'firebase-admin'

 
import dotenv from 'dotenv';
dotenv.config();

const passcode = process.env.ENCRYPTION_KEY;

const serviceAccount = 'V1/config/firebaseKKey.json'
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


//hash password
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
//check if password is correct
export const PasswordCorrect = async (req, userExists) => {
  
    const password = req.body.password
    console.log("pass", password)
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
            return true
        } catch (err) {
            console.log('Error: ', err)
            return false
        }
    }
    
    sendEmail(email, 'Thank you for Joining our wait list', 'waitlistEmail', { userName: fullName })
}

export  const TransferEmailToSender = async (email, senderName, transact, emailAmount)=>{
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
          return true
      } catch (err) {
          console.log('Error: ', err)
          return false
      }
  }
  
  sendEmail(email, 'Transaction Notification', 'senderTransferEmail', { userName: senderName, data:transact })
}

export  const TransferEmailToReciver = async (reciverEmail, reciverName, senderName, transact)=>{
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
          return true
      } catch (err) {
          console.log('Error: ', err)
          return false
      }
  }
  
  sendEmail(reciverEmail, 'Transaction Notification', 'reciverTransferEmail', { userName: reciverName, data:transact, senderName:senderName })
}

export  const DeleteLinkEmail = async (email, firstName, lastName, url)=>{
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
          return true
      } catch (err) {
          console.log('Error: ', err)
          return false
      }
  }
  
  sendEmail(email, 'Delete Account Notification', 'DeleteAccountEmail', { email, firstName, lastName, url, data:url})
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

    }catch(error){
        throw new Error('Decrytion failed', error)
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


  export const Dologin = async ( res, req) =>{
    const jwt  = pkg;
    console.log("working here", req.body)
    const phoneNumber = req.body.phoneNumber;
 
    try {
      //check if user with email already exists
      const userExists = await User.findOne({phoneNumber});
      if (!userExists) {
          return res.status(404).send({ msg: "User does not exist" });
      }
      //check if password is correct
      const passwordCorrect = await PasswordCorrect(req, userExists);
      if (passwordCorrect) {
          const user = {
             data: userExists
          }
          const accessToken = jwt.sign({ user: user }, 'mayorgnn@088',
          {
              expiresIn: '8760h'
          });
          console.log("userr", user.data)
          const newdata = {
            passcode:user.data.lockPin,
            FaceImageUrl:user.data.FaceImageUrl,
            firstName:user.data.firstName,
            lastName:user.data.lastName


          }
          return res.status(200).send({
              msg: "Login Successful",
              status:true,
              accessToken,
              data:newdata
          })
      }
      if (!passwordCorrect) {
          return res.status(404).send({
             msg: "Password is incorrect" ,
             status:false
            });
      }
  } catch (error) {
      res.status(400).send({
        msg: "There was a network error please try again" ,
        status:false
       
      });
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

export  const emailOtp = async (email, token)=>{
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
            return true
        } catch (err) {

            console.log('Error here: ', err)
            return false
        }
    }
    
    sendEmail(email, 'Lemu Email Verification ', 'otpEmail', { token: token })
}


export const uploadloadImg = async (req, res) => {
  // Append the upload preset to the formData
  formData.append('upload_preset', 'Qrcode');

  const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDNAME}/image/upload`,
      {
          method: 'POST',
          body: formData,
          // Don't forget to set headers to inform Cloudinary about the FormData content type
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      }
  );

  const uploadData = await uploadResponse.json();

  console.log("checking", uploadData);
};


export const verifyAccountNumber = async (req, res) => {
    let accountNumber = req.body.accountNumber;
    // find user with account number
    try {
      let user = await User.findOne({ accountNumber: accountNumber });
      if (user) {
        const newData = {
          accountName: user.firstName +" "+ user.lastName ,
          token:user.token,
          accountNumber:user.accountNumber
          // Corrected line
        };
        const data = {
            status:true,
            msg:"User Found!",
            data:newData
        }
        return res.status(200).send(data);
      }else{
        const data = {
            status:false,
            msg:"User with Account number not found",
        }
        return res.status(200).send(data);
      }
    } catch (error) {
      console.log(error);
    }
  };


export const transfer = async(req, res)=>{

  console.log("my daata",req.body)

  const transactionReference = await generateTransactionReference()

  // validation 
  const {amount, narration, pin, bankName, bankCode, paymentMethod} = req.body;

  if(!amount || !narration || !pin || !bankName || !bankCode || !paymentMethod){
    const data = {
      msg:"Please provide all required fields",
      status:false
    }
    return res.status(200).send(data);
  }
  
  //find the customer by account number 
  const reciver = req.body.accountNumber;
  const findReciver = await User.findOne({accountNumber:reciver})
  

  // find sender and check account balance
  //const sender = req.user.data
  const getSender = await User.findOne({_id: req.user.data._id})
  let sender = getSender
  // check if pin is cccorrect
  console.log("pin",sender.pin)
  if(sender.trxpin !== req.body.pin){
    const data={
      status : false,
      msg : "Invalid Transaction Pin"
    }
    return res.status(200).send(data);
  }

  if(amount > sender.balance){
    const data = {
      msg:"Insufficient funds",
      status:false
    }
    return res.status(200).send(data);
  }

  //remove funds from sender
  let updateSenderBalance = parseInt(sender.balance)  - parseInt(amount) 
  const newSender = await User.updateOne({_id :sender._id}, {balance:updateSenderBalance});
  newSender

  //add to reciever
  

  //save transaction
  const transact = new Transaction({
    senderId: sender._id,
    recipientId: findReciver._id,
    senderName: sender.firstName +" "+ sender.lastName,
    recipientName:findReciver.firstName +" "+ findReciver.lastName,
    transactionReference:transactionReference,
    amount: amount,
    type:'transfer',
    status:'pending',
    description:req.body.narration,
    paymentMethod:req.body.paymentMethod,
    bankName:req.body.bankName, 
    token:req.body.token
  })
  try{
     await transact.save()
     .then((transaction) => {
      transaction
      //  console.log('Transaction created', transaction)
     })
  //add funds to reciever

  let addAmountToReciever = parseInt(findReciver.balance ) + parseInt(amount);
  const newReciever = await User.updateOne({_id:findReciver._id},{balance:addAmountToReciever})

  if(newReciever) {
    // update transaaction status to approved 
    transact.status='approved'
    await transact.save();
    const senderEmail = sender.email;
    const senderName = sender.firstName +" "+ sender.lastName;
    const reciverName =  findReciver.firstName +" "+ findReciver.lastName;
    const reciverEmail = findReciver.email
    const token = req.body.token
    const message = `${senderName} sent you ${req.body.amount} `
    // const emailAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    TransferEmailToSender(senderEmail, senderName, transact)
    TransferEmailToReciver(reciverEmail, reciverName, senderName, transact)

    sendNotification(token, message)

    const data = {
      msg:"Transfer Successful",
      data:transact,
      status:true
    }
    return res.status(200).send(data);
  }



}catch(error){
  const data ={
    msg:"Transfer was not succuessful",
    status:false
  }
  return res.status(200).send(data);

}
}


export const  generateTransactionReference = async()=> {
  // Get current date in YYYYMMDD format
  const currentDate = new Date();
  const datePart = currentDate.toISOString().slice(0,10).replace(/-/g,"");

  // Generate random characters for the remaining digits
  const randomPartLength = 30 - datePart.length;
  let randomPart = '';
  for (let i = 0; i < randomPartLength; i++) {
      randomPart += Math.floor(Math.random() * 10); // Random digit between 0 and 9
  }

  // Concatenate date part and random part
  const transactionReference = datePart + randomPart;

  return transactionReference;
}

export const  generateAccountNumber = async()=> {
  // Get current date in YYYYMMDD format
  const currentDate = new Date();
  const datePart = currentDate.toISOString().slice(0,10).replace(/-/g,"");

  // Generate random characters for the remaining digits
  const randomPartLength = 10 - datePart.length;
  let randomPart = '';
  for (let i = 0; i < randomPartLength; i++) {
      randomPart += Math.floor(Math.random() * 10); // Random digit between 0 and 9
  }

  // Concatenate date part and random part
  const transactionReference = datePart + randomPart;

  return transactionReference;
}

export const getAllTransacctionByUser = async(req, res)=>{
  try{
    const transacction = await Transaction.find({user: req.user._id});
    console.log("all trx here", transacction)

    const data ={
      msg:"all transactions by user",
      status:true,
      data:transacction
    }
    return res.status(200).send(data);
  }catch(error){
    console.log(error);
  }
}


export const getPaid = async(req, res)=>{

  const transactionReference = await generateTransactionReference()

  // validation 
  const {amount, narration, pin} = req.body;

  // if(!amount || !narration || !pin){
  //   const data = {
  //     msg:"Please provide all required fields",
  //     status:false
  //   }
  //   return res.status(200).send(data);
  // }
  
  // //find the customer by account number 
   const findSender = req.body.accountNumber;
   const sender = await User.findOne({accountNumber:findSender})

   
  

  // // find reciver and check account balance
  //const findReciver = req.user.data
   const findReciver = await User.findOne({_id: req.user.data._id})
  // let sender = getSender
  // // check if pin is cccorrect
  // console.log("pin",sender.pin)
  // if(sender.trxpin !== req.body.pin){
  //   const data={
  //     status : false,
  //     msg : "Invalid Transaction Pin"
  //   }
  //   return res.status(200).send(data);
  // }

  if(amount > sender.balance){
    const data = {
      msg:"Insufficient funds",
      status:false
    }
    return res.status(200).send(data);
  }

  // //remove funds from sender
  let updateSenderBalance = parseInt(sender.balance)  - parseInt(amount) 
  const newSender = await User.updateOne({_id :sender._id}, {balance:updateSenderBalance});
  // newSender

  // //add to reciever
  

  //save transaction
  const transact = new Transaction({
    senderId: sender._id,
    recipientId: findReciver._id,
    senderName: sender.firstName +" "+ sender.lastName,
    recipientName:findReciver.firstName +" "+ findReciver.lastName,
    transactionReference:transactionReference,
    amount: amount,
    type:'transfer',
    status:'pending',
    description:req.body.narration,
    paymentMethod:req.body.paymentMethod,
    bankName:req.body.bankName
  })
  try{
     await transact.save()
     .then((transaction) => {
      transaction
      //  console.log('Transaction created', transaction)
     })
  //add funds to reciever

  let addAmountToReciever = parseInt(findReciver.balance ) + parseInt(amount);
  const newReciever = await User.updateOne({_id:findReciver._id},{balance:addAmountToReciever})

  if(newReciever) {
    // update transaaction status to approved 
    transact.status='approved'
    await transact.save();
    const senderEmail = sender.email;
    const senderName = sender.firstName +" "+ sender.lastName;
    const reciverName =  findReciver.firstName +" "+ sender.lastName;
    const reciverEmail = findReciver.email
    // const emailAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    TransferEmailToSender(senderEmail, senderName, transact)
    TransferEmailToReciver(reciverEmail, reciverName, senderName, transact)
    const data = {
      msg:"Transfer Successful",
      data:transact,
      status:true
    }
    return res.status(200).send(data);
  }
}catch(error){
  const data ={
   msg:"Transfer was not succuessful",
   status:false
  }
  return res.status(200).send(data);

}
}

//email delete account url to user email 
export const SendDeleteUrl = async(req, res)=>{
  // find user with phone number
  console.log(req.body)

  const user = await User.findOne({phoneNumber:req.body.phoneNumber})
  console.log("there", user)
  try{
    if(user){
      console.log("user", user)
      const { _id, phoneNumber, firstName, lastName, email} = user
      const url = `https://lemu.africa/deleteAccount/${_id}/${firstName}/${lastName}/${phoneNumber}`
      //send email to user with delete link
      DeleteLinkEmail(email, firstName, lastName, url)
      if(DeleteLinkEmail){
        const data = {
          msg:"A Delete link has been sent to your registed email address",
          status:true
        }
        return res.status(200).send(data);
      }else{
        const data = {
          msg:"An error occured while sending the delete link",
          status:false
        }
        return res.status(200).send(data);
      }
    }else{
      const data = {
        msg:"User with phone number was not found, please check the phone number again",
        status:false
      }
      return res.status(200).send(data);

    }

  }catch(error){
    const data ={
      msg:"An error occured while sending the delete link",
      status:false
    }
    return res.status(200).send(data);

  }
  

}


export const DeleteAccount = async(req, res)=>{
  console.log("req", req.body)
  try{
    let userId= req.body.userId;
    let phone = req.body.phoneNumber 
    let newphone = "d"+phone
    const getuser = await User.findOne({phoneNumber:req.body.phoneNumber})
    if(getuser){
      await User.updateOne({_id:userId},{$set:{ status : 'deactivated', phoneNumber:newphone }});
      const data = {
         status : true,
         msg:"Account Deleted Successfully"
       }
       console.log("working heere")
      return res.status(200).json(data);

    }else{
      const data = {
        status : false,
        msg:"User with phone number was not found, please check the phone number again"
      }
      return res.status(200).json(data);
    }
    
}catch(e){
    return res.status(500).json({msg:"Server Error!"})
}
}


export const sendNotification = async (token, message) => {
  console.log("came here now")
  const messagePayload = {
    notification: {
      title: 'New Message',
      body: message,
    },
   token:token
    // token: 'eg3cri8mQ5qc5mGzMOpi0d:APA91bGMqT1kMbIz3f-7TncgVfHYEpT2-61-vaQizqzVPeX80wkhwYvSmWyc_VBCzIyM491wFyFHOMbOgCEOdQJu_1iIUHVZmnQ0GMa3haT5xSsEAz73lIqb76g4gKG0XYPWlftlVm3o',
  };

  try {
    await admin.messaging().send(messagePayload);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const saveBeneficiary = async (req, res)=>{
  const {id, accountName, token, narration, accountNumber, amount, recipientName, senderName, senderId} = req.body
  const newdata = {
    accountName,token, narration, accountNumber, amount, recipientName, senderName, senderId
  } 
  //find user with id 
  const findUser = await User.findOne({_id:id})
  if(findUser){
    const update = await User.updateOne({_id :findUser._id}, {beneficiaries:newdata});
    update
  }else{
    console.log("there was an error")
  }
  


}





