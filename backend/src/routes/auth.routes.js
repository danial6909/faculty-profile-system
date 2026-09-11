const express = require("express");
const router = express.Router();

const { login, logout, me } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth");

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);

module.exports = router;
