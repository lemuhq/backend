import  express from "express";
const router = express.Router();

import { Register, Login, JoinWaitList } from "../controllers/user/index.js";



router.post("/api/v1/register", Register);
router.post("/api/v1/login", Login);
router.post("/api/v1/waitlist", JoinWaitList);






export { router as userRoute };