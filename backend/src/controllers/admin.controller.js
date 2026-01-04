export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "admin", "moderator"].includes(role)) {
      throw new AppError("Invalid role", 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: "-password" }
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};
