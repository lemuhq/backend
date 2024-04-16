import Waitlist from "../../models/Waitlist.js";
import User from "../../models/Users.js";

export const saveWaitlist = async (req, res) => {
   
     const email = req.body.email;
    const fullName = req.body.fullName;
    try {
        //Check if email exists
        // const userExist = await Waitlist.findOne({ email: email });
        // if (userExist) {
        //     const data = {
        //         message: "We appreciate the love, but it seems you've already signed up. Thank you for your interest!",
        //         status: true,
        //         data: null
        //     };
        //     return res.status(200).send(data);
        // }

        // If email doesn't exist, add to waitlist
        const result = Waitlist({ email, fullName });
         await result.save();
         await  waitlistEmail(email, fullName);

        const data = {
            message: "Thank you for joining our waitlist! We are on the edge of something new and can't wait to share our updates with you.",
            status: true,
            data: null
        }
        res.status(200).send(data);
    } catch (err) {
        const data = {
            message: "There was an error in your request.",
            data: err,
            status: false
        };
        res.status(500).send(data);
    }
};