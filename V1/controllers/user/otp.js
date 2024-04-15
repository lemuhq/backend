// import { sendSms } from "../../utils.js";
import {sendSms} from '../../utils/index.js'


export  const CreateOtp = async (req, res)=>{
     console.log("all good here")
    //
    function generateRandom4DigitNumber() {
        // Generate a random number between 1000 and 9999
        return Math.floor(Math.random() * 9000) + 1000;
    }
    // Example usage
    const random4DigitNumber = generateRandom4DigitNumber();
    console.log(random4DigitNumber);
    const data = {
        otp: random4DigitNumber,
        phoneNumber: req.body.phoneNumber,
        message:`your otp is ${random4DigitNumber} `,
        status:true
    }
    return res.status(200).send(data)

    // const handleSendsms = await sendSms(data)
    // handleSendsms

    // if(handleSendsms.status == true){
    //     return res.status(200).send(data)
    // }else{
    //     const data = {
    //         message:`there was error sending your otp `,
    //         status:false
    //     }
    //     return res.status(503).send(data)
    // }

    
}