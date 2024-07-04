import { Router } from "express";
import { deleteChats, getAllChats, newChat } from "../controllers/chatsController.js";
import { verifyToken } from "../utils/token.js";

const chatRouter = Router();

chatRouter.get("/allChats", verifyToken, getAllChats);
chatRouter.post("/new", verifyToken, newChat);
chatRouter.delete("/delete", verifyToken, deleteChats);

export default chatRouter;