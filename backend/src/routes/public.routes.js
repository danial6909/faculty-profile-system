const express = require("express");
const router = express.Router();

const { listProfessors, getProfessorProfile } = require("../controllers/public.controller");

router.get("/professors", listProfessors);
router.get("/professors/:slug", getProfessorProfile);

module.exports = router;
