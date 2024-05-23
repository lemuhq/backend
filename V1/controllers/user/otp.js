// import { sendSms } from "../../utils.js";
import {sendSms} from '../../utils/index.js'
import { emailOtp, waitlistEmail } from '../../utils/index.js';
import Otp from '../../models/Otp.js';
import moment from 'moment';


export  const CreateOtp = async (req, res)=>{
     console.log("all good here", req.body)
    
    //
    function generateRandom4DigitNumber() {
        // Generate a random number between 1000 and 9999
        return Math.floor(Math.random() * 9000) + 1000;
    }
    const random4DigitNumber = generateRandom4DigitNumber();
    const email = req.body.email
    const token = random4DigitNumber
    // Example usage
 
     const expiryTime = moment().add(5, 'minutes');
      const SaveOtp = new Otp({token:random4DigitNumber, expiryTime:expiryTime})
      try{
        await  SaveOtp.save()
        await  emailOtp(email, token)
        const data = {
            otp: random4DigitNumber,
            phoneNumber: req.body.phoneNumber,
            message:`your otp is ${random4DigitNumber} `,
            status:true
        }
       
        return res.status(200).send(data)

      }catch(err){
        console.log(err)
      }
  
}

export const verifyOTP = async(req, res) => {
   console.log("this is pin", req.body.pin)
   const otp = req.body.pin
    try {
        
        const result = await Otp.findOne({token:otp});
        

        if (result) {
            // Check if OTP has expired
            if(moment() <= moment(result.expiryTime)) {
                // Delete the OTP document from the collection
                await Otp.deleteOne({ token:otp });
                const data = {
                    message:`OTP is valid`,
                    status:true
                }
                return res.status(200).send(data)
                //return true; // OTP is valid
            } else {
                const data = {
                    message:`OTP has expired`,
                    status:false
                }
               // await Otp.deleteOne({ token:otp });
                return res.status(200).send(data)
                
            }
        } else {
            const data = {
                message:`OTP not found`,
                status:false
            }
            return res.status(200).send(data)
        }
    } finally {
        console.log("close")
    }
}