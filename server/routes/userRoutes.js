const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.listUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUser);

module.exports = router;
