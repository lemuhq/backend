import  {decryptData } from '../../utils/index.js' 
export const decodeData = async (req, res, next) => {
    console.log("this iss here",req.body)
    const encryptedText = req.body.data
    const decryptedText = await decryptData(encryptedText)
    console.log("this is decrypted",JSON.stringify(decryptedText))
    try{
        const decodedData = JSON.parse(decryptedText)
        return res.status(200).send({
            msg: "Data decorded",
            data:decodedData,
            status: true

        })
    }catch(error){
        return res.status(400).send({
            msg: "Login Failed",
            status:false
        })
    }


}