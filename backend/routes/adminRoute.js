const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAdmin } = require("../middlewares/authMiddleware");
router.use(isAdmin);
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/suspend", adminController.suspendUser);
router.patch("/users/:id/activate", adminController.activateUser);

module.exports = router;