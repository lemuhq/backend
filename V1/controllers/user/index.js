 import User from "../../models/Users.js"
 import {  waitlistEmail } from "../../utils/index.js"
 import Waitlist from "../../models/Waitlist.js";
 import { encryptData, decryptData, generateQR, uploadloadImg, hashPassword, Dologin, verifyAccountNumber, generateAccountNumber } from "../../utils/index.js";
 import dotenv from 'dotenv';
 dotenv.config();
 import fs from 'fs';
 import pkg from 'jsonwebtoken';
 import { v2 as cloudinary } from 'cloudinary';

 cloudinary.config({ 
    cloud_name: 'dzn8kbkvz', 
    api_key: '697557842338172', 
    api_secret: 'WYJatpbuhR7taeJu2R1EY4c46Pw' 
  });
 
 
 export  const Register = async (req, res)=>{
    const AccNumber = await generateAccountNumber()
    console.log("hetr",req.body)
    const jwt  = pkg;

// Usage example

// check if user exite
let userExist = await User.findOne({phoneNumber: req.body.phoneNumber})
if(userExist) {
    const data ={
        message: "User already exist",
        status: false,
        data: null
    }

 return res.status(200).send(data);
}


//res.status(409).json("User already exist")

 // Encrypt the password and save it to database
 let encrypted_password = await hashPassword(req.body.password);
const objectToEncrypt = {
    accountNumber:AccNumber,
    firstName: req.body.firstName,
    lastName:req.body.lastName,
    trackingReference: 1300231651122,
    phoneNumber: req.body.phoneNumber,
    email:req.body.email,
    Address:req.body.Address,
    FaceImageUrl:req.body.FaceImageUrl,
    trxpin:req.body.trxpin,
    lockPin:req.body.lockPin

}
const saveDate = {
    accountNumber:AccNumber,
    firstName: req.body.firstName,
    lastName:req.body.lastName,
    trackingReference: 1300231651122,
    phoneNumber: req.body.phoneNumber,
    email:req.body.email,
    Address:req.body.Address,
    FaceImageUrl:req.body.FaceImageUrl,
    trxpin:req.body.trxpin,
    lockPin:req.body.lockPin

}

const encryptedText =  await encryptData(objectToEncrypt);
console.log(encryptedText)

const createQrCode =  await generateQR(encryptedText)
createQrCode
const qrcodeUrl = createQrCode
const balance = 500
const password = encrypted_password


// payload
const dataTosave = {...saveDate,  qrcodeUrl, balance, password};

// save data to database
try{
    let user = await  User(dataTosave)
    
    user.save()
     const accessToken = jwt.sign({ user: user }, 'mayorgnn@088',
     {
         expiresIn: '1h'
     });
     return res.status(200).send({
         msg: "Login Successful",
         accessToken,
         //data:user
     })
  
}catch(err){
   return console.log(err)

}



// const decryptedText = await decryptData(encryptedText)
// console.log(decryptedText)


    
}

export const Login = async (req, res)=>{
   await Dologin(res, req)
}

export const JoinWaitList = async (req, res) => {
    console.log("here", req.body.email);
    const email = req.body.email;
    const fullName = req.body.fullName;
    try {
        // Check if email exists
        const userExist = await Waitlist.findOne({ email: email });
        if (userExist) {
            const data = {
                message: "We appreciate the love, but it seems you've already signed up. Thank you for your interest!",
                status: true,
                data: null
            };
            return res.status(200).send(data);
        }

        // If email doesn't exist, add to waitlist
        const result = new Waitlist({ email, fullName });
        await result.save();
        await waitlistEmail(email, fullName); // Ensure this function is awaited properly

        const data = {
            message: "Thank you for joining our waitlist! We are on the edge of something new and can't wait to share our updates with you.",
            status: true,
            data: null
        };
        res.status(200).send(data);
    } catch (err) {
        const data = {
            message: "There was an error in your request.",
            data: err, // Make sure the error object is informative for debugging
            status: false
        };
        res.status(500).send(data); // Correctly handle internal server errors
    }
};

export const OurWaitlist =  async (req, res)=>{
    console.log("here", req.body.email);
    const email = req.body.email;
    const fullName = req.body.fullName;
    //const userExist = await Waitlist.findOne({ email: email });
    // if (userExist) {
    //     const data = {
    //         message: "We appreciate the love, but it seems you've already signed up. Thank you for your interest!",
    //         status: true,
    //         data: null
    //     };
    //     return res.status(200).send(data);
    // }

    try{
        const data = {
                    message: "We appreciate the love, but it seems you've already signed up. Thank you for your interest!",
                    status: true,
                    data: null
                };
                return res.status(200).send(data);
            

    }catch(error){
        console.log(error)
    }


    // try {
    //     //Check if email exists
    //     const userExist = await Waitlist.findOne({ email: email });
    //     if (userExist) {
    //         const data = {
    //             message: "We appreciate the love, but it seems you've already signed up. Thank you for your interest!",
    //             status: true,
    //             data: null
    //         };
    //         return res.status(200).send(data);
    //     }

    //     // If email doesn't exist, add to waitlist
    //     const result = new Waitlist({ email, fullName });
    //     const response = await result.save();
        
    //    // waitlistEmail(email, fullName);

    //     const data = {
    //         message: "Thank you for joining our waitlist! We are on the edge of something new and can't wait to share our updates with you.",
    //         status: true,
    //         data: response
    //     }
    //      res.set('Content-Type', 'application/json');
    //     res.status(200).send(data);
    // } catch (error) {
    //     const data = {
    //         message: "There was an error in your request.",
    //         data: error,
    //         status: false
    //     };
    //     res.status(500).send(data);
    // }
}

export const uplaodTocloud = async(req,res) =>{
    let file = req.body.formData;
    console.log("this is file",file._parts[0][1].assets[0])
    let newphoto = file._parts[0][1].assets[0];

    const data = new FormData();
    data.append('file', newphoto);
    data.append('upload_preset', 'Qrcode');

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDNAME}/image/upload`,
      {
        method: 'POST',
        body: data
      }
    );

    const uploadData = await uploadResponse.json();
    console.log(uploadData)
   
}


export const VerifyAccount = async(req, res)=>{
    verifyAccountNumber(req, res)
}
 
