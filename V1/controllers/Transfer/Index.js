
import { transfer, getPaid } from '../../utils/index.js';

export const  doTransfer = async (req, res)=>{
    transfer(req, res)
}

export const doGetPaid = async (req, res) =>{
    console.log("here too")
    getPaid(req, res)
}

