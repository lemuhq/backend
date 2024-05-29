import  express from "express";
const router = express.Router();

import {  JoinWaitList,uplaodTocloud, Register, Login, VerifyAccount  } from "../controllers/user/index.js";
import { CreateOtp, verifyOTP } from '../controllers/user/otp.js';
import { saveWaitlist } from "../controllers/user/list.js";
import { ValidateToken } from "../middleware/validateToken.js";
import { getCurrentUser } from "../controllers/user/getCurrentUser.js";
import { doTransfer , doGetPaid} from "../controllers/Transfer/Index.js";
import { decodeData } from "../controllers/user/decodeData.js";
import { getAllTrxByUser } from "../controllers/user/getAllTrxByUser.js";
import { DeleteRequest } from "../controllers/user/deleteRequest.js";
import { DeleteAccount } from "../utils/index.js";




router.post("/api/v1/register", Register);
router.post("/api/v1/login", Login);
router.post("/api/v1/waitlist", saveWaitlist);
router.post("/api/v1/createotp", CreateOtp);
router.post("/api/v1/verifyotp", verifyOTP);
router.post("/api/v1/uploadimage", uplaodTocloud)
router.get("/api/v1/currentUser",ValidateToken, getCurrentUser)
router.post("/api/v1/verifyAccount", ValidateToken, VerifyAccount)
router.post("/api/v1/transfer", ValidateToken, doTransfer)
router.post("/api/v1/decodeData", ValidateToken, decodeData)
router.get("/api/v1/getAllTrxByUser",ValidateToken, getAllTrxByUser)
router.post("/api/v1/getPaid", ValidateToken, doGetPaid)
router.post("/api/v1/requestDeleteAccount", DeleteRequest)
router.post("/api/v1/deleteAccount", DeleteAccount)







export { router as userRoute };