module.exports = (req, res, next) => {
  // auth.middleware already sets req.user
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};
