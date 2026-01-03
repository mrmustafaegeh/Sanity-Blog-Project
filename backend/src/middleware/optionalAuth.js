import jwt from "jsonwebtoken";

export function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (auth?.startsWith("Bearer ")) {
    try {
      req.user = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    } catch {
      req.user = null;
    }
  }

  next();
}
