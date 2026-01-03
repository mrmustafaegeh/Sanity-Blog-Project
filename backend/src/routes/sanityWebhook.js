import express from "express";
import sanityClient from "../lib/sanityClient.js";
import extractText from "../utils/extractText.js";
import { generateSummary } from "../services/aiSummary.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { _id, _type } = req.body;
  if (_type !== "post") return res.json({ skipped: true });

  const post = await sanityClient.getDocument(_id);
  if (!post?.body || post.aiSummary) return res.json({ skipped: true });

  const text = extractText(post.body);
  const summary = await generateSummary(text);

  await sanityClient
    .patch(_id)
    .set({
      aiSummary: summary,
      aiStatus: "completed",
    })
    .commit();

  res.json({ success: true });
});

export default router;
