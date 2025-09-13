import express from "express";
const app = express();
import dotenv from 'dotenv';
import mongoose from "mongoose";
import morgan from "morgan";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatsRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectRedis from "./utils/redisConn.js";

if (process.env.NODE_ENV != "production") {
    dotenv.config();  //to access  env file variables
}

const PORT = process.env.PORT || 8080;


//database connection
//mongoDB
main()
    .then(() => {
        console.log("connected to ask-gpt database");
    })
    .catch(err => console.log(err));

async function main() {

    await mongoose.connect(process.env.MONGODB_URL);
}

//Redis
export const redis = await connectRedis();



// middlewares
app.use(cors({ origin: "https://askgpt-ai.netlify.app", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);


app.listen(PORT, () => {
    console.log("server is listening at port 8080");
});

export { app };