import { Router } from "express";
import { deleteChats, getAllChats, newChat } from "../controllers/chatsController.js";
import { verifyToken } from "../utils/token.js";
import rateLimiter from "../middleware/rateLimiter.js";

const chatRouter = Router();

chatRouter.get("/allChats", verifyToken, rateLimiter(100, 60), getAllChats);
chatRouter.post("/new", verifyToken, rateLimiter(100, 60), newChat);
chatRouter.delete("/delete", verifyToken, rateLimiter(100, 60), deleteChats);

export default chatRouter;