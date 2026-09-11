const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const upload = require("../middlewares/upload");
const ctrl = require("../controllers/professor.controller");
const uploadCtrl = require("../controllers/upload.controller");

router.use(authMiddleware, requireRole("PROFESSOR"));

router.get("/profile", ctrl.getProfile);
router.patch("/profile", ctrl.updateProfile);
router.patch("/theme", ctrl.updateTheme);

router.post("/avatar", upload.single("avatar"), uploadCtrl.uploadAvatar);
router.post("/upload-image", upload.single("image"), uploadCtrl.uploadGenericImage);

router.get("/sections", ctrl.listActiveSections);
router.get("/sections/:key/data", ctrl.getSectionData);
router.post("/sections/:key/data", ctrl.addSectionItem);
router.patch("/sections/:key/data/:groupIndex", ctrl.updateSectionItem);
router.delete("/sections/:key/data/:groupIndex", ctrl.deleteSectionItem);

module.exports = router;
