import mongoose from 'mongoose';
const { Schema } = mongoose;

const partSchema = new Schema({
    text: {
        type: String,
        required: true,
    }
});

const chatSchema = new Schema({
    role: {
        type: String,
        required: true,
        enum: ['user', 'model'],
    },
    parts: [partSchema],
});

export default chatSchema;

//no need to create a collection i.e. model sepately as a chat dont have independent existence. It is always linked to a user
// {
//     role: "user",
//     parts: [{ text: "Hello, I have 2 dogs in my house." }],
//   },
