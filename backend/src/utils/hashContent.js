import crypto from "crypto";

export const hashContent = (content) => {
  if (!content) return "";
  return crypto.createHash("md5").update(content).digest("hex");
};

export default hashContent;
