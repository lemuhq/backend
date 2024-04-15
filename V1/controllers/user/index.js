 import User from "../../models/Users.js"
 import { hashPassword, waitlistEmail } from "../../utils/index.js"
 import Waitlist from "../../models/Waitlist.js";
 import { encryptData, decryptData, generateQR , login} from "../../utils/index.js";
 import dotenv from 'dotenv';
 dotenv.config();
 import fs from 'fs';
 import pkg from 'jsonwebtoken';
 
 
 export  const Register = async (req, res)=>{
    const jwt  = pkg;

// Usage example

// check if user exite
let userExist = await User.findOne({phoneNumber: req.body.data.phoneNumber})
if(userExist) 

 return res.status(409).send({
    message: "User already exist",
    status: false,
    data: null
});
//res.status(409).json("User already exist")

 // Encrypt the password and save it to database
 let encrypted_password = await hashPassword(req.body.password); 
const objectToEncrypt = {
    accountNumber: "2504349511",
    firstName: req.body.data.firstName,
    lastName:req.body.data.lastName,
    trackingReference: 1300231651122,
    phoneNumber: req.body.data.phoneNumber,
    email:req.body.data.email,
    Address:req.body.data.Address
}

const encryptedText =  await encryptData(objectToEncrypt);
console.log(encryptedText)

const createQrCode =  await generateQR(encryptedText)
createQrCode
const qrcodeUrl = createQrCode
const balance = 500
const lockPin = req.body.lockPin
const trxPin = req.body.trxPin
const password = encrypted_password


// payload
const dataTosave = {...objectToEncrypt,  qrcodeUrl, balance, lockPin, trxPin, password};

// save data to database
try{
    let user = await  User(dataTosave)
    await waitlistEmail(req.body.data.email, req.body.data.firstName);
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
    console.log("login")
}

// export const JoinWaitList = async (req, res) => {
//     console.log("here", req.body.email);
//     const email = req.body.email;
//     const fullName = req.body.fullName;
//     try {
//         //Check if email exists
//         const userExist = await Waitlist.findOne({ email: email });
//         if (userExist) {
//             const data = {
//                 message: "We appreciate the love, but it seems you've already signed up. Thank you for your interest!",
//                 status: true,
//                 data: null
//             };
//             return res.status(200).send(data);
//         }

//         // If email doesn't exist, add to waitlist
//         const result = new Waitlist({ email, fullName });
//          await result.save();
//          await  waitlistEmail(email, fullName);

//         const data = {
//             message: "Thank you for joining our waitlist! We are on the edge of something new and can't wait to share our updates with you.",
//             status: true,
//             data: null
//         }
//         res.status(200).send(data);
//     } catch (err) {
//         const data = {
//             message: "There was an error in your request.",
//             data: err,
//             status: false
//         };
//         res.status(500).send(data);
//     }
// };


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

