import Click from "../models/Click.model.js";
import Short from "../models/Url.model.js";
import { fillMissingDates } from "../utils/helpers.js";
import redisClient from "../config/redis.js";

export const getAnalytics = async (req, res) => {
  try {
    const { alias } = req.params;
    const cacheKey = `analytics:${req.user.id}:${alias}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    const url = await Short.findOne({ alias: alias, user: req.user.id }).lean();

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const analytics = await Click.aggregate([
      {
        $match: {
          shortUrl: url._id,
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $facet: {
          totalClicks: [{ $count: "count" }],
          uniqueUsers: [{ $group: { _id: "$userHash" } }, { $count: "count" }],
          clicksByDate: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          osData: [
            {
              $group: {
                _id: "$osName",
                uniqueClicks: { $addToSet: "$userHash" },
                totalClicks: { $sum: 1 },
              },
            },
          ],
          deviceData: [
            {
              $group: {
                _id: "$deviceType",
                uniqueClicks: { $addToSet: "$userHash" },
                totalClicks: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const result = {
      totalClicks: analytics[0].totalClicks[0]?.count || 0,
      uniqueUsers: analytics[0].uniqueUsers[0]?.count || 0,
      clicksByDate: fillMissingDates(analytics[0].clicksByDate),
      osType: analytics[0].osData.map((os) => ({
        osName: os._id,
        uniqueClicks: os.uniqueClicks.length,
        uniqueUsers: os.uniqueClicks.length,
      })),
      deviceType: analytics[0].deviceData.map((device) => ({
        deviceName: device._id,
        uniqueClicks: device.uniqueClicks.length,
        uniqueUsers: device.uniqueClicks.length,
      })),
    };

    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error });
  }
};

export const getTopicAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;

    const cacheKey = `analytics:${req.user._id}:topic:${topic}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const urls = await Short.find({ topic, user: req.user.id })
      .select("_id")
      .lean();
    console.log("urls", urls);
    const urlIds = urls.map((url) => url._id);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const analytics = await Click.aggregate([
      {
        $match: {
          shortUrl: { $in: urlIds },
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $facet: {
          totalClicks: [{ $count: "count" }],
          uniqueUsers: [{ $group: { _id: "$userHash" } }, { $count: "count" }],
          clicksByDate: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          urlStats: [
            {
              $group: {
                _id: "$shortUrl",
                totalClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$userHash" },
              },
            },
          ],
        },
      },
    ]);

    const urlDetails = await Short.find({
      _id: { $in: analytics[0].urlStats.map((stat) => stat._id) },
    }).lean();

    const result = {
      totalClicks: analytics[0].totalClicks[0]?.count || 0,
      uniqueUsers: analytics[0].uniqueUsers[0]?.count || 0,
      clicksByDate: fillMissingDates(analytics[0].clicksByDate),
      urls: urlDetails.map((url) => ({
        shortUrl: `${process.env.BASE_URL}/${url.alias}`,
        totalClicks:
          analytics[0].urlStats.find((stat) => stat._id.equals(url._id))
            ?.totalClicks || 0,
        uniqueUsers:
          analytics[0].urlStats.find((stat) => stat._id.equals(url._id))
            ?.uniqueUsers.length || 0,
      })),
    };

    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching topic analytics", error });
  }
};

export const getOverallAnalytics = async (req, res) => {
  try {
    const cacheKey = `analytics:${req.user._id}:overall`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    const urls = await Short.find({ user: req.user.id }).select("_id").lean();

    const urlIds = urls.map((url) => url._id);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const analytics = await Click.aggregate([
      {
        $match: {
          shortUrl: { $in: urlIds },
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $facet: {
          totalClicks: [{ $count: "count" }],
          uniqueUsers: [{ $group: { _id: "$userHash" } }, { $count: "count" }],
          clicksByDate: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          osData: [
            {
              $group: {
                _id: "$osName",
                uniqueClicks: { $addToSet: "$userHash" },
                totalClicks: { $sum: 1 },
              },
            },
          ],
          deviceData: [
            {
              $group: {
                _id: "$deviceType",
                uniqueClicks: { $addToSet: "$userHash" },
                totalClicks: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const result = {
      totalUrls: urls.length,
      totalClicks: analytics[0].totalClicks[0]?.count || 0,
      uniqueUsers: analytics[0].uniqueUsers[0]?.count || 0,
      clicksByDate: fillMissingDates(analytics[0].clicksByDate),
      osType: analytics[0].osData.map((os) => ({
        osName: os._id,
        uniqueClicks: os.uniqueClicks.length,
        uniqueUsers: os.uniqueClicks.length,
      })),
      deviceType: analytics[0].deviceData.map((device) => ({
        deviceName: device._id,
        uniqueClicks: device.uniqueClicks.length,
        uniqueUsers: device.uniqueClicks.length,
      })),
    };
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));

    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching overall analytics", error });
  }
};
