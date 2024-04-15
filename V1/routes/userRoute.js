import  express from "express";
const router = express.Router();

import { Register, Login, OurWaitlist  } from "../controllers/user/index.js";
import { CreateOtp } from '../controllers/user/otp.js';



router.post("/api/v1/register", Register);
router.post("/api/v1/login", Login);
router.post("/api/v1/ourwaitlist",OurWaitlist);
router.post("/api/v1/createotp", CreateOtp);






export { router as userRoute };