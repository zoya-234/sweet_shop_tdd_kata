const User = require("../models/User");

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    // Explicit duplicate check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = await User.create({ email, password });

    return res.status(201).json({
      message: "User registered successfully",
      user: { email: user.email },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
