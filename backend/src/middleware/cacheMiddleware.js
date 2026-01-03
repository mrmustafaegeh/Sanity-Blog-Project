import redis from "../redis/redisClient.js";

export function cache(keyBuilder, ttl = 600) {
  return async (req, res, next) => {
    const key = keyBuilder(req);

    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    res.sendResponse = res.json;
    res.json = async (body) => {
      await redis.setex(key, ttl, JSON.stringify(body));
      res.sendResponse(body);
    };

    next();
  };
}
