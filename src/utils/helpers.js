import { UAParser } from "ua-parser-js";

export const parseUserAgent = (uaString) => {
  const parser = new UAParser(uaString);
  return {
    os: parser.getOS().name || "Other",
    device: parser.getDevice().type || "Desktop",
  };
};

export const getGeoFromIP = async (ip) => {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    return {
      country: data.country_name || "Unknown",
      region: data.region || "Unknown",
      city: data.city || "Unknown",
    };
  } catch (error) {
    return { country: "Unknown", region: "Unknown", city: "Unknown" };
  }
};
export const fillMissingDates = (data) => {
  const dates = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  const dateMap = new Map();
  data.forEach((item) => dateMap.set(item._id, item.count));

  return dates.map((date) => ({
    date,
    clicks: dateMap.get(date) || 0,
  }));
};
