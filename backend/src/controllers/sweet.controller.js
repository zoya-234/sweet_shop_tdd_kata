const Sweet = require("../models/Sweet");

exports.addSweet = async (req, res) => {
  const { name, price, quantity } = req.body;

  if (!name || price == null || quantity == null) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const sweet = await Sweet.create({ name, price, quantity });
    return res.status(201).json(sweet);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    return res.status(200).json(sweets);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
