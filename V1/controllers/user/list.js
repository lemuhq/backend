import Waitlist from "../../models/Waitlist.js";
import User from "../../models/Users.js";
import { waitlistEmail } from "../../utils/index.js";

export const saveWaitlist = async (req, res) => {
    const email = req.body.email
    const fullName = req.body.fullName

    const userExist = await Waitlist.findOne({ email: email });
        if (userExist) {
            const data = {
                message: "We appreciate the love, but it seems you've already signed up. Thank you for your interest!",
                status: true,
                data: null
            };
            return res.status(200).send(data);
        }
   
  try {
    let dataTosave = {
        email:req.body.email,
        fullName:req.body.fullName
    }
    let user = await  Waitlist(dataTosave)
    user.save()
    await  waitlistEmail(email, fullName);
    
    const data = {
                    message: "Thank you for joining our waitlist! We are on the edge of something new and can't wait to share our updates with you.",
                    status: true,
                    data: null
                }
                res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ message: 'Error saving waitlist', error });
    console.error('Error saving waitlist', error);
  }
};