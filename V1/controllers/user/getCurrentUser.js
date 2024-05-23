import User from "../../models/Users.js";

export const getCurrentUser = async (req, res, next) => {
    const user = req.user.data._id
    let current_user = await User.findOne({_id:user});
   return res.status(200).send(current_user);
    
}