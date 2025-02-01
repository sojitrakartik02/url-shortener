import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
 
});

redisClient.on("error", (err) => console.error("Redis error:", err));

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected successfully");
  return redisClient;
};

export default redisClient;
