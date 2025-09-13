import { Router } from "express";
import { login, logout, signup, verified } from "../controllers/userController.js";
import { loginValidators, signupValidators, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token.js";
import rateLimiter from "../middleware/rateLimiter.js";

const userRouter = Router();




userRouter.post("/login", validate(loginValidators), rateLimiter(100, 60), login);
userRouter.post("/signup", validate(signupValidators), rateLimiter(100, 60), signup);

userRouter.get("/logout", rateLimiter(100, 60), logout);
userRouter.get("/verify", verifyToken, rateLimiter(100, 60), verified);

export default userRouter;

