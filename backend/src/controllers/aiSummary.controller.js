import Post from "../models/Post.js";
import { generateSummary } from "../services/ai/aiSummary.service.js";
import { hashContent } from "../utils/hashContent.js";

// Regenerate AI summary for a post
export const regenerateSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Generate new summary
    const newSummary = await generateSummary(post.content);
    const newHash = hashContent(post.content);

    // Update post
    post.aiSummary = newSummary;
    post.aiHash = newHash;

    // Add to history array if it exists
    if (post.aiSummaryHistory && Array.isArray(post.aiSummaryHistory)) {
      post.aiSummaryHistory.push({
        summary: newSummary,
        createdAt: new Date(),
        generatedBy: req.user._id,
      });
    }

    await post.save();

    res.json({
      success: true,
      message: "AI summary regenerated successfully",
      aiSummary: newSummary,
    });
  } catch (error) {
    console.error("Error regenerating AI summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to regenerate AI summary",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Process new post webhook (for auto-generating summaries)
export const processNewPost = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if summary already exists
    if (post.aiSummary) {
      return res.json({
        success: true,
        message: "AI summary already exists",
        skipped: true,
      });
    }

    // Generate summary
    const summary = await generateSummary(post.content);
    const hash = hashContent(post.content);

    post.aiSummary = summary;
    post.aiHash = hash;
    await post.save();

    res.json({
      success: true,
      message: "AI summary generated successfully",
      aiSummary: summary,
    });
  } catch (error) {
    console.error("Error processing new post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate AI summary",
    });
  }
};
