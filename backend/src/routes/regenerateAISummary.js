import express from "express";
import sanityClient from "../lib/sanityClient.js";
import extractText from "../utils/extractText.js";
import hashContent from "../utils/hashContent.js";
import { generateSummary } from "../services/aiSummary.js";

const router = express.Router();

router.post("/:id", async (req, res) => {
  try {
    const post = await sanityClient.getDocument(req.params.id);
    if (!post?.body) return res.status(404).json({ error: "Post not found" });

    const text = extractText(post.body);
    const hash = hashContent(text);

    if (post.aiHash === hash) {
      return res.json({ skipped: "No changes" });
    }

    const summary = await generateSummary(text);

    await sanityClient
      .patch(post._id)
      .set({
        aiSummary: summary,
        aiHash: hash,
        aiStatus: "completed",
      })
      .commit();

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Regeneration failed" });
  }
});

export default router;
