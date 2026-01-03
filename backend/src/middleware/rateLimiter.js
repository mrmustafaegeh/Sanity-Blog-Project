import redis from "../redis/redisClient.js";
import AppError from "../utils/AppError.js";

export const rateLimit = ({ keyPrefix, limit = 10, windowSec = 60 }) => {
  return async (req, res, next) => {
    try {
      const identifier = req.ip || req.headers["x-forwarded-for"] || "global";

      const key = `${keyPrefix}:${identifier}`;

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowSec);
      }

      if (current > limit) {
        throw new AppError("Too many requests. Please try again later.", 429);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
