import User from "../models/userModel.js";
import { compare, hash } from "bcrypt";
import { createToken } from "../utils/token.js";



export const signup = async (req, res) => {
    try {
        let { email, password, name } = req.body;

        let user = await User.findOne({ email });
        console.log(user);

        if (user) {
            return res.status(400).json({ message: "ERROR", cause: "User already registered" });
        }

        let hashedPassword = await hash(password, 10);

        let newUser = new User({
            name, email, password: hashedPassword, chats: []
        });

        let result = await newUser.save();

        res.clearCookie("auth_token", { //removing previous token of user if stored
            path: "/",
            domain: "localhost",
            httpOnly: true,
            signed: true,
        });


        let token = createToken(result._id, result.email, "7d");
        let expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie("auth_token", token, { //storing token in form of http cookie
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });


        res.status(200).json({ message: "OK", name, email, id: result._id });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "ERROR", cause: err.message })
    }
}

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        let arr = await User.find({ email });
        let user = arr[0];

        if (!user) {
            return res.status(400).json({ messsage: "ERROR", cause: "User not registered" });
        }

        let result = await compare(password, user.password);

        if (!result) {
            return res.status(400).json({ message: "ERROR", cause: "password is incorrect" });
        }



        res.clearCookie("auth_token", { //removing previous token of user if stored
            path: "/",
            domain: "localhost",
            httpOnly: true,
            signed: true,
        });

        let token = createToken(user._id, user.email, "7d");
        let expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie("auth_token", token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });

        return res.status(200).json({ message: "OK" });
    } catch (err) {
        return res.status(400).json({ message: "ERROR", cause: err.message });
    }


}

export const logout = (req, res) => {
    try {
        res.clearCookie("auth_token", {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            signed: true,
        });

        return res.status(200).json({ message: "OK" });
    } catch (err) {
        return res.status(400).json({ message: "ERROR", cause: err.message });
    }


}


export const verified = (req, res) => {
    return res.status(200).json({ message: "OK" });
}