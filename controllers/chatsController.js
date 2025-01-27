import User from "../models/userModel.js";
import { model } from "../utils/geminiAIconfig.js";


export const getAllChats = async (req, res) => {
    try {
        let { id, email } = res.locals.jwtData;

        let user = await User.findById({ _id: `${id}` });
        let chats = user.chats;

        return res.status(200).json({ message: "OK", chats });

    } catch (err) {
        return res.status(400).json({ message: "ERROR", cause: err.message });
    }

}

export const newChat = async (req, res) => {
    try {
        let { newChat } = req.body;
        let { id, email } = res.locals.jwtData;

        let user = await User.findById({ _id: `${id}` });

        let newChatObj = {
            role: "user",
            parts: [],
        };


        let textObj = { text: newChat };
        newChatObj.parts.push(textObj);


        user.chats = [...user.chats, newChatObj];
        //console.log(user.chats);

        let apiChats = user.chats.map((obj) => {
            let role = obj.role;
            let parts = obj.parts;

            parts = parts.map((obj1) => {
                let text = obj1.text;
                return { text };
            });



            let temp = { role, parts };


            return temp;
        });
        //  console.log(apiChats);
        // send to genai api and get new chats and update user 
        const chat = model.startChat({
            history: apiChats,
            generationConfig: {
                maxOutputTokens: 100,
            },
        });


        const result = await chat.sendMessage(newChat);
        const response = await result.response;
        const text = response.text();
        //console.log(text);
        user.chats = [...user.chats, {
            role: "model",
            parts: [{ text }],
        }];

        user.save();


        return res.status(200).json({ message: "OK", chats: user.chats });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "ERROR", cause: err.message });
    }

}

export const deleteChats = async (req, res) => {
    try {
        let { id, email } = res.locals.jwtData;

        let user = await User.findById({ _id: `${id}` });

        user.chats = [];
        user.save();

        return res.status(200).json({ message: "OK" });

    } catch (err) {
        return res.status(400).json({ message: "ERROR", cause: err.message });
    }

}


// {
//     role: "user",
//     parts: [{ text: "Hello, I have 2 dogs in my house." }],
// },
// {
//     role: "model",
//     parts: [{ text: "Great to meet you. What would you like to know?" }],
// },
