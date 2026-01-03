import sanityClient from "../lib/sanityClient.js";
import redis from "../redis/redisClient.js";
import AppError from "../utils/AppError.js";
import { generateSummary } from "../services/ai/aiSummary.service.js";

/**
 * POST /api/posts/:id/summary
 * Admin only
 * Regenerates AI summary and stores history
 */
export async function regenerateSummary(req, res, next) {
  const { id } = req.params;
  const lockKey = `lock:summary:${id}`;

  // 1️⃣ Prevent concurrent AI calls (Redis lock)
  const lock = await redis.set(lockKey, "locked", "NX", "EX", 60);
  if (!lock) {
    return next(
      new AppError("AI summary is already being generated. Please wait.", 429)
    );
  }

  try {
    // 2️⃣ Fetch post from Sanity
    const post = await sanityClient.fetch(
      `*[_type == "post" && _id == $id][0]{
        content,
        slug
      }`,
      { id }
    );

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    // 3️⃣ Convert Portable Text → plain text
    const plainText = post.content
      ?.map((block) => block.children?.map((child) => child.text).join(""))
      .join("\n");

    if (!plainText) {
      throw new AppError("Post content is empty", 400);
    }

    // 4️⃣ Generate AI summary
    const summary = await generateSummary(plainText);

    // 5️⃣ UPDATE SANITY DOCUMENT  ✅ THIS IS THE CODE YOU ASKED ABOUT
    await sanityClient
      .patch(id)
      .set({ aiSummary: summary })
      .append("aiSummaryHistory", [
        {
          summary,
          createdAt: new Date().toISOString(),
        },
      ])
      .commit();

    // 6️⃣ Invalidate Redis cache
    if (post.slug?.current) {
      await redis.del(`post:${post.slug.current}`);
    }

    // 7️⃣ Response
    res.status(200).json({
      status: "success",
      aiSummary: summary,
    });
  } catch (error) {
    next(error);
  } finally {
    // 8️⃣ Always release lock
    await redis.del(lockKey);
  }
}
