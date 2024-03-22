 import User from "../../models/Users.js"
 import { hashPassword } from "../../utils/index.js"
 
 
 export  const Register = async (req, res)=>{
   
    const password = await hashPassword(req.body.password);
    const newdata = {...req.body, password}

    const user = new User(newdata);
    const phoneNumber = req.body.data.phoneNumber

    try{
        const userExists = await User.find({phoneNumber: req.body.data.phoneNumber});

        console.log("user", userExists.length)
        if (userExists) {
            console.log(userExists)
            return res.status(201).send({message: "User already exist" });
        }

        // make a call to Kuda 

        //save to lumu database 
        
        user.save()

        //send an email

        //return response to mobile app

       
        res.status(200).send({message: "Signup successful", data: user, status:true});

    }catch(error){
        console.log("error", error)
        res.status(400).send(error);
    }
    
}

export const Login = async (req, res)=>{
    console.log("login")
}

