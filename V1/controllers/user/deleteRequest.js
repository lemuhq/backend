
import {SendDeleteUrl} from '../../utils/index.js'


export const DeleteRequest = async (req, res)=>{
    console.log("req", req.body)
    await SendDeleteUrl(req, res)
}