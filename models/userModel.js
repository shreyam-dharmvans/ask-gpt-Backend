import mongoose from 'mongoose';
import chatSchema from './chatSchema.js';
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    chats: [chatSchema],
});

userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);
export default User; 