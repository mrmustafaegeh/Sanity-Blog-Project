// controllers/user.controller.js
import User from "../models/User.js";
import Post from "../models/Post.js";
import Submission from "../models/Submission.js";

// Get public author profile
export const getAuthorProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      username,
      role: { $in: ["author", "admin", "moderator"] },
    }).select("-password -email -resetPasswordToken -resetPasswordExpire");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    // Get author's published posts
    const posts = await Post.find({
      author: user._id,
      status: "published",
    })
      .populate("categories", "title slug")
      .sort({ publishedAt: -1 })
      .limit(10)
      .select(
        "title slug excerpt publishedAt views likesCount commentsCount mainImage"
      )
      .lean();

    // Get author stats
    const totalPosts = await Post.countDocuments({
      author: user._id,
      status: "published",
    });

    const totalLikes = await Post.aggregate([
      { $match: { author: user._id, status: "published" } },
      { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } },
    ]);

    res.json({
      success: true,
      user,
      posts,
      stats: {
        totalPosts,
        totalLikes: totalLikes[0]?.totalLikes || 0,
        totalViews: await Post.aggregate([
          { $match: { author: user._id, status: "published" } },
          { $group: { _id: null, totalViews: { $sum: "$views" } } },
        ]).then((result) => result[0]?.totalViews || 0),
        followers: user.followers?.length || 0,
        following: user.following?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error getting author profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user profile (public or private based on authentication)
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const query = userId ? { _id: userId } : { _id: req.user._id };
    const selectFields = userId
      ? "-password -email -resetPasswordToken -resetPasswordExpire"
      : "-password -resetPasswordToken -resetPasswordExpire";

    const user = await User.findOne(query).select(selectFields);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user's posts
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = { author: userId };
    if (status) query.status = status;

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate("categories", "title slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query),
    ]);

    res.json({
      success: true,
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error getting user posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user's liked posts
export const getUserLikedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({
        likes: req.user._id,
        status: "published",
      })
        .populate("author", "name username")
        .populate("categories", "title slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({ likes: req.user._id, status: "published" }),
    ]);

    res.json({
      success: true,
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error getting liked posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user's submissions
export const getUserSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id };
    if (status) query.status = status;

    const [submissions, total] = await Promise.all([
      Submission.find(query)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Submission.countDocuments(query),
    ]);

    res.json({
      success: true,
      submissions,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error getting user submissions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user's bookmarks
export const getUserBookmarks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id).populate({
      path: "bookmarks",
      match: { status: "published" },
      options: {
        sort: { createdAt: -1 },
        skip: skip,
        limit: limit,
      },
      populate: [
        { path: "author", select: "name username" },
        { path: "categories", select: "title slug" },
      ],
    });

    const total = user.bookmarks.length;

    res.json({
      success: true,
      bookmarks: user.bookmarks || [],
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error getting bookmarks:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Toggle bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const { postId } = req.params;

    const user = await User.findById(req.user._id);
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const postIndex = user.bookmarks.findIndex(
      (bookmark) => bookmark.toString() === postId
    );

    if (postIndex === -1) {
      // Add bookmark
      user.bookmarks.push(postId);
      await user.save();
      res.json({
        success: true,
        message: "Post bookmarked",
        bookmarked: true,
      });
    } else {
      // Remove bookmark
      user.bookmarks.splice(postIndex, 1);
      await user.save();
      res.json({
        success: true,
        message: "Bookmark removed",
        bookmarked: false,
      });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user stats
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalPosts,
      publishedPosts,
      pendingPosts,
      draftPosts,
      likesAggregate,
      viewsAggregate,
      commentsAggregate,
      totalSubmissions,
      bookmarksCount,
    ] = await Promise.all([
      Post.countDocuments({ author: userId }),
      Post.countDocuments({ author: userId, status: "published" }),
      Post.countDocuments({ author: userId, status: "pending" }),
      Post.countDocuments({ author: userId, status: "draft" }),
      Post.aggregate([
        { $match: { author: userId } },
        { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } },
      ]),
      Post.aggregate([
        { $match: { author: userId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } },
      ]),
      Post.aggregate([
        { $match: { author: userId } },
        { $group: { _id: null, totalComments: { $sum: "$commentsCount" } } },
      ]),
      Submission.countDocuments({ userId }),
      User.findById(userId).then((user) => user?.bookmarks?.length || 0),
    ]);

    res.json({
      success: true,
      stats: {
        posts: {
          total: totalPosts,
          published: publishedPosts,
          pending: pendingPosts,
          draft: draftPosts,
        },
        engagement: {
          totalLikes: likesAggregate[0]?.totalLikes || 0,
          totalViews: viewsAggregate[0]?.totalViews || 0,
          totalComments: commentsAggregate[0]?.totalComments || 0,
        },
        submissions: totalSubmissions,
        bookmarks: bookmarksCount,
        followers: await User.findById(userId).then(
          (user) => user?.followers?.length || 0
        ),
        following: await User.findById(userId).then(
          (user) => user?.following?.length || 0
        ),
      },
    });
  } catch (error) {
    console.error("Error getting user stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Follow user
export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const currentUser = await User.findById(req.user._id);

    // Check if already following
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Already following this user",
      });
    }

    // Add to following list
    currentUser.following.push(userId);
    await currentUser.save();

    // Add to user's followers list
    userToFollow.followers.push(req.user._id);
    await userToFollow.save();

    res.json({
      success: true,
      message: "User followed successfully",
      following: true,
      followersCount: userToFollow.followers.length,
    });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findById(req.user._id);
    const userToUnfollow = await User.findById(userId);

    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove from following list
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userId
    );
    await currentUser.save();

    // Remove from user's followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await userToUnfollow.save();

    res.json({
      success: true,
      message: "User unfollowed successfully",
      following: false,
      followersCount: userToUnfollow.followers.length,
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get followers list
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("followers", "name username email image bio")
      .select("followers");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      followers: user.followers || [],
    });
  } catch (error) {
    console.error("Error getting followers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get following list
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("following", "name username email image bio")
      .select("following");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      following: user.following || [],
    });
  } catch (error) {
    console.error("Error getting following:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Check if following user
export const checkFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.includes(userId);

    res.json({
      success: true,
      following: isFollowing,
    });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, website, twitter, github, linkedin } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (twitter !== undefined) user.twitter = twitter;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;

    await user.save();

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpire;

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
