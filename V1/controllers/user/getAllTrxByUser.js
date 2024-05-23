import { getAllTransacctionByUser } from "../../utils/index.js"

export const getAllTrxByUser = async (req, res, next) => {
   await getAllTransacctionByUser(req, res)
    
}