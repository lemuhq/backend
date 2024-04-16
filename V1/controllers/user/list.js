import Waitlist from "../../models/Waitlist.js";
import User from "../../models/Users.js";

export const saveWaitlist = async (req, res) => {
   
  try {
    let dataTosave = {
        email:req.body.email,
        fullName:req.body.fullName
    }
    let user = await  Waitlist(dataTosave)
    user.save()
    
     return res.status(200).send({
         msg: "Login Successful",
         //accessToken,
         //data:user
     })
  } catch (error) {
    res.status(500).json({ message: 'Error saving waitlist', error });
    console.error('Error saving waitlist', error);
  }
};