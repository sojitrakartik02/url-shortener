import app from "./app.js";
import connectDB from "./config/database.js";
import redisClient from "./config/redis.js";
import "dotenv/config";
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    await redisClient.connect();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
