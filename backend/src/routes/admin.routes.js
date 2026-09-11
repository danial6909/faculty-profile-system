const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const {
  listSections,
  createSection,
  updateSection,
  deleteSection,
  listProfessorsAdmin,
  updateProfessorStatus,
} = require("../controllers/admin.controller");

// همه‌ی این روت‌ها اول احراز هویت می‌شوند، بعد چک می‌شود role برابر ADMIN باشد
router.use(authMiddleware, requireRole("ADMIN"));

router.get("/sections", listSections);
router.post("/sections", createSection);
router.patch("/sections/:id", updateSection);
router.delete("/sections/:id", deleteSection);

router.get("/professors", listProfessorsAdmin);
router.patch("/professors/:id/status", updateProfessorStatus);

module.exports = router;
