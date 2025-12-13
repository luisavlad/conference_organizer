const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST /api/users/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      isAvailable: true,
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAvailable: user.isAvailable,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/users/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/users/me
exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ["id", "name", "email", "role", "isAvailable", "createdAt", "updatedAt"],
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/users (only ORGANIZER)
exports.listUsers = async (req, res) => {
  try {
   
    if (req.user.role !== "ORGANIZER") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "isAvailable", "createdAt", "updatedAt"],
    });

    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// PATCH /api/users/me
exports.updateMe = async (req, res) => {
  try {
    const { name, isAvailable } = req.body;

    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (typeof name === "string") user.name = name;

    if (typeof isAvailable === "boolean" && user.role === "REVIEWER") {
      user.isAvailable = isAvailable;
    }

    await user.save();

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAvailable: user.isAvailable,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
