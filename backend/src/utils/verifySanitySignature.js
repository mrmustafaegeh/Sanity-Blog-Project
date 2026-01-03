import crypto from "crypto";

export function verifySanitySignature(req, secret) {
  const signature = req.headers["x-sanity-signature"];
  if (!signature || !req.rawBody) return false;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(req.rawBody).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
