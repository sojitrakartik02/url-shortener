import ShortUrl from "../models/Url.model.js";
import Click from "../models/Click.model.js";
import redisClient from "../config/redis.js";
import { parseUserAgent, getGeoFromIP } from "../utils/helpers.js";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";

export const createShortUrl = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { longUrl, customAlias, topic } = req.body;
    console.log("req.user", req.user);
    if (!validator.isURL(longUrl)) {
      return res.status(400).json({ error: "Invalid URL" });
    }
    const alias = customAlias || uuidv4().slice(0, 8);

    if (customAlias) {
      const exists = await ShortUrl.findOne({ alias: customAlias });
      if (exists)
        return res.status(400).json({ error: "Alias already exists" });
    }
    const urlshort = `${process.env.BASE_URL}/${alias}`;
    const shortUrl = await ShortUrl.create({
      longUrl,
      shortUrl: urlshort,
      alias,
      user: req.user.id,
      topic,
    });

    res.status(201).json({
      message: "Success",
      data: shortUrl,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    console.log(req.params.alias);

    const urlDoc = await ShortUrl.findOne({ alias: req.params.alias });
    if (!urlDoc) return res.status(404).json({ error: "URL not found" });

    const cachedUrl = await redisClient.get(req.params.alias);
    if (cachedUrl) {
      console.log("cachedUrl", cachedUrl);
      return res.redirect(cachedUrl);
    }

    const userAgent = parseUserAgent(req.headers["user-agent"]);
    const geo = await getGeoFromIP(req.ip);
    console.log(
      `redirectUrl: ${JSON.stringify(userAgent)} and geo ${JSON.stringify(geo)}`
    );

    await Click.create({
      shortUrl: urlDoc._id,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      osName: userAgent.os,
      deviceType: userAgent.device,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      userHash: `${req.ip}-${req.headers["user-agent"]}`.substring(0, 64),
    });
    console.log("Click data stored");

    await redisClient.setEx(req.params.alias, 3600, urlDoc.longUrl);

    console.log("Redirecting to:", urlDoc.longUrl);
    res.redirect(urlDoc.longUrl);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
