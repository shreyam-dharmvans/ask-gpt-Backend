import { app, redis } from "../app.js";
import request from 'supertest';
import mongoose from "mongoose";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import signature from "cookie-signature";

let authCookie;
let testUserId;

describe("user api", () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URL);
        await User.deleteOne({ email: "test@gmail.com" });
    })

    afterAll(async () => {
        if (testUserId) {
            await User.findByIdAndDelete(testUserId);
        }
        await mongoose.connection.close();
    });

    test("test user signup", async () => {
        const res = await request(app)
            .post('/api/v1/user/signup')
            .send({ name: "test user", email: "test@gmail.com", password: "test1234" });

        expect(res.status).toBe(200);
        expect(res.body.id).toBeDefined();

        testUserId = res.body.id;

        //Create cookie once after signup
        const authToken = jwt.sign(
            { id: res.body.id, email: res.body.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        const signedToken = signature.sign(authToken, process.env.COOKIE_SECRET);
        authCookie = `auth_token=s:${signedToken}`;
    })

    test("test user login", async () => {
        const res = await request(app)
            .post('/api/v1/user/login')
            .send({ email: "test@gmail.com", password: "test1234" });

        expect(res.status).toBe(200);
    })

    test("test get chat api", async () => {
        const res = await request(app)
            .get('/api/v1/chat/allChats')
            .set('Cookie', authCookie);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("OK");
        expect(Array.isArray(res.body.chats)).toBe(true);
    })

    // test("test create new chat", async () => {
    //     const res = await request(app)
    //         .post('/api/v1/chat/new')
    //         .set('Cookie', authCookie)
    //         .send({ newChat: "Hello, this is a test message" });

    //     expect(res.status).toBe(200);
    //     expect(res.body.message).toBe("OK");
    //     expect(Array.isArray(res.body.chats)).toBe(true);
    // }, 15000) // 15 second timeout for AI API call

    test("test delete chats", async () => {

        const res = await request(app)
            .delete('/api/v1/chat/delete')
            .set('Cookie', authCookie);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("OK");
    })

    test("test unauthorized access", async () => {
        const res = await request(app)
            .get('/api/v1/chat/allChats');

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("ERROR");
        expect(res.body.cause).toBe("token not present");
    })

    test("test redis caching", async () => {

        const uncachedUserData = await request(app)
            .get('/api/v1/chat/allChats')
            .set('Cookie', authCookie);

        const cachedUserData = await request(app)
            .get('/api/v1/chat/allChats')
            .set('Cookie', authCookie);

        expect(uncachedUserData.body.chats).toEqual(cachedUserData.body.chats);

    })

    // test("test rate limiting", async () => {
    //     for (let i = 0; i <= 2; i++) {
    //         const res = await request(app)
    //             .get('/api/v1/chat/allChats')
    //             .set('Cookie', authCookie);
    //         if (i === 2) {
    //             expect(res.status).toBe(429);
    //         } else {
    //             expect(res.status).toBe(200);
    //         }
    //     }
    // })

})