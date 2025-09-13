import { redis } from "../app.js";

const rateLimiter = (limit, window) => {
    return async (req, res, next) => {
        const ip = req.ip;

        const key = `rateLimit:${ip}:${req.originalUrl}`;

        const current = await redis.incr(key);

        if (current == 1) {
            await redis.expire(key, window);
        }
        else if (current > limit) {
            const ttl = await redis.ttl(key);

            return res.status(429).json({
                message: `Too many requests. Please try again after ${ttl} seconds.`
            });
        }

        next();
    }
}

export default rateLimiter;