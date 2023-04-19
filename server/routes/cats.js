const express = require("express");
const router = express.Router();
const CatController = require("../controllers/catController");

router.get("/tags", CatController.getAllTags);

module.exports = router;