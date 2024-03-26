 import User from "../../models/Users.js"
 import { hashPassword, waitlistEmail } from "../../utils/index.js"
 import Waitlist from "../../models/Waitlist.js";
 
 
 export  const Register = async (req, res)=>{
   
    const password = await hashPassword(req.body.password);
    const newdata = {...req.body, password}
    const phoneNumber = req.body.phoneNumber
    const email = req.body.email
    const fullname = `${req.body.firstName} ${req.body.lastName}`

    const user = new User(newdata);


    function validatePhoneNumber(phoneNumber) {
        // Regular expression for a phone number validation
        var phoneRegex = /^0\d{10}$/;
      
        // Test the phone number against the regular expression
        var isValid = phoneRegex.test(phoneNumber);
      
        return isValid;
      }

      function validateFullname(fullname) {
        // Regular expression to check for two names, and no numbers or special characters
        var nameRegex = /^[a-zA-Z]+\s[a-zA-Z]+$/;
        
        // Test the full name against the regular expression and check for non-empty string
        var isValid = nameRegex.test(fullname) && fullname.trim() !== '';
        
        return isValid;
      }
      
      function validateEmail(email) {
        // Regular expression for a simple email validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
        // Test the email against the regular expression and check for non-empty string
        var isValid = emailRegex.test(email) && email.trim() !== '';
      
        return isValid;
      }

        
//   function validatePin(pin) {
//     // Regular expression for a PIN validation
//     var pinRegex = /^\d{4}$/;
  
//     // Test the PIN against the regular expression
//     var isValid = pinRegex.test(pin);
  
//     return isValid;
//   }
  


if(!validatePhoneNumber(phoneNumber)){
    return res.status(200).send({msg:"Invalid Phone Number!"})
}
// if(!validateAge(age)){
//     return res.status(200).send({msg:"Please enter valid Age!"})
// }

// if(!validatePin(pin)){
//     return res.status(200).send({msg:`Invalid piin`})
// }
// if(!validateFullname(fullname)){
//     return res.status(200).send({msg:`Invalid full name`})
// }

if(!validateEmail(email)){
    return res.status(200).send({msg:`Invalid email`})
}





    try{
        const userExists = await User.findOne({phoneNumber});

        // console.log("user", userExists.length)
        if (userExists) {
            console.log(userExists)
            return res.status(201).send({message: "User already exist" });
        }

        // make a call to Kuda 

        //save to lumu database 
        
       const save =  await user.save()

        //send an email
      await waitlistEmail(email, fullname)

        //return response to mobile app

       
        res.status(200).send({message: "Signup successful", data: save, status:true});

    }catch(error){
        console.log("error", error)
        res.status(400).send(error);
    }
    
}

export const Login = async (req, res)=>{
    console.log("login")
}

export const JoinWaitList = async (req, res)=>{
    console.log("herre",req.body.email)
    const email = req.body.email
    const result = new  Waitlist({email})
    try{
        const response = await result.save()
        response
       waitlistEmail(email)
        const data = {
            message:"Thank you for Joining our waitlist, we are on the edge of something new! we can't wait to share our updates with you",
            status:true,
            data:null
        }

        res.status(200).send(data);
    }catch(error){
        const data = {
            message:"There wass an error in your request.",
            data:null,
            status:false,
        }
        res.status(500).send(data)
    }



}

