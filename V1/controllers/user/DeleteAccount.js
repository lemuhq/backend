import {DeleteAccount} from '../../utils/index.js'


export const DeleteUserAccount = async (req, res)=>{
    console.log("req", req.body)
    await DeleteAccount(req, res)
}