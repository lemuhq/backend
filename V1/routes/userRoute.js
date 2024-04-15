import  express from "express";
const router = express.Router();

import { Register, Login, JoinWaitList,  } from "../controllers/user/index.js";
import { CreateOtp } from '../controllers/user/otp.js';



router.post("/api/v1/register", Register);
router.post("/api/v1/login", Login);
router.post("/api/v1/waitlist", JoinWaitList);
router.post("/api/v1/createotp", CreateOtp);






export { router as userRoute };