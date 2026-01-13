const User = require("../models/userModels");

// GET /api/users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "isAvailable",
        "createdAt",
        "updatedAt",
      ],
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "isAvailable",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await User.create({
      name,
      email,
      role,
      isAvailable: true,
    });

    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// PATCH /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { name, isAvailable } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (typeof name === "string") user.name = name;
    if (typeof isAvailable === "boolean") user.isAvailable = isAvailable;

    await user.save();
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
