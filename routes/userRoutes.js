import { Router } from "express";
import { login, logout, signup, verified } from "../controllers/userController.js";
import { loginValidators, signupValidators, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token.js";

const userRouter = Router();




userRouter.post("/login", validate(loginValidators), login);
userRouter.post("/signup", validate(signupValidators), signup);

userRouter.get("/logout", logout);
userRouter.get("/verify", verifyToken, verified);

export default userRouter;

