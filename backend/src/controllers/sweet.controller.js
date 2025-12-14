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

exports.updateSweet = async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;

  try {
    const sweet = await Sweet.findByIdAndUpdate(
      id,
      { name, price, quantity },
      { new: true }
    );

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    return res.status(200).json(sweet);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSweet = async (req, res) => {
  const { id } = req.params;

  try {
    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    return res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.searchSweets = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const sweets = await Sweet.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    });

    res.status(200).json(sweets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.purchaseSweet = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    sweet.quantity -= quantity;
    await sweet.save();

    return res.status(200).json(sweet);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.restockSweet = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    sweet.quantity += quantity;
    await sweet.save();

    return res.status(200).json(sweet);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
