import { redis } from "../app.js";
import User from "../models/userModel.js";


export const fetchUser = async (id) => {
    let user;
    user = await redis.get(`user:${id}`);

    if (user == null) {
        user = await User.findById(id);
        await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
    } else {
        user = JSON.parse(user);
        user = await User.hydrate(user);
    }

    return user;
}