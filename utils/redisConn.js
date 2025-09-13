import Redis from "ioredis";


const connectRedis = async () => {
    const redis = new Redis(process.env.REDIS_URL);

    redis.on("connect", () => {
        console.log("Connected to Redis");
    })

    return redis;
}

export default connectRedis;


