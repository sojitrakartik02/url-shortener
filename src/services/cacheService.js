import redisClient from "../config/redis.js";

export const cacheUrl = async (shortUrl, longUrl) => {
  try {
    await redisClient.setEx(shortUrl, 3600, longUrl);
  } catch (error) {
    logger.error(`Cache error: ${error.message}`);
  }
};

export const getCachedUrl = async (shortUrl) => {
  try {
    return await redisClient.get(shortUrl);
  } catch (error) {
    logger.error(`Cache retrieval error: ${error.message}`);
    return null;
  }
};
