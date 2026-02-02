import express from "express";
import { Login, Logout, Register, resetpassword, sendresetotp, sendverifyotp, verifyemail , isauthenticated} from "../controller/authcontroller.js";
import userAuth from "../middleware/userauth.js";

const authRouter = express.Router();

authRouter.post('/register', Register);
authRouter.post('/login', Login);
authRouter.post('/logout', Logout);
authRouter.post('/send-verify-otp', userAuth , sendverifyotp);
authRouter.post('/verify-account', userAuth, verifyemail);
authRouter.get('/is-auth', userAuth, isauthenticated);
authRouter.post('/send-reset-otp', sendresetotp);
authRouter.post('/resetpass', resetpassword);


export default authRouter;