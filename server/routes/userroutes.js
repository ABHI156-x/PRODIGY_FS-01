import express from "express";
import userAuth from "../middleware/userauth.js";
import { getuserdata } from "../controller/usercontroller.js";

const userRouter = express.Router();

userRouter.get('/data', userAuth, getuserdata);

export default userRouter;