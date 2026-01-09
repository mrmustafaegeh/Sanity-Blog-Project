import Post from "../models/Post.js";

// Increment view count
export const incrementView = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      views: post.views,
    });
  } catch (error) {
    console.error("Error incrementing view:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
