// controllers/adminController.js

const User = require('../models/User');

/* ==============================
   ADMIN STATS
============================== */
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
      },
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
};

/* ==============================
   GET ALL USERS
============================== */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ==============================
   UPDATE USER
============================== */
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ==============================
   DELETE USER
============================== */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ==============================
   GET ELDER CARE LIST
============================== */
exports.getAllElderCare = async (req, res) => {
  try {
    const elders = await User.find({ role: "elder" }).select("-password");

    res.json({
      success: true,
      elders,
    });
  } catch (err) {
    console.error("Elder care error:", err);
    res.status(500).json({ message: "Failed to fetch elder care list" });
  }
};
