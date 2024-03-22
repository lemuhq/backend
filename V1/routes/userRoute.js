import  express from "express";
const router = express.Router();

import { Register, Login } from "../controllers/user/index.js";


router.post("/api/v1/register", Register);
router.post("/api/v1/login", Login);






export { router as userRoute };