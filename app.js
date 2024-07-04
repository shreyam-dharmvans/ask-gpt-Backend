import express from "express";
const app = express();
import dotenv from 'dotenv';
import mongoose from "mongoose";
import morgan from "morgan";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatsRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

if (process.env.NODE_ENV != "production") {
    dotenv.config();  //to access  env file variables
}


//database connection
main()
    .then(() => {
        console.log("connected to ask-gpt database");
    })
    .catch(err => console.log(err));

async function main() {

    await mongoose.connect(process.env.MONGODB_URL);
}

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));


app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);





app.listen(process.env.PORT, () => {
    console.log("server is listening at port 8080");
});