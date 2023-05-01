const express = require("express");
const router = express.Router();
const apicache = require("apicache");
const controller = require("../controllers/index");

// Magic values
const CACHE_EXPIRATION_TIME = "1 hour";

// Init cache
const cache = apicache.middleware;

router.get("/tags", cache(CACHE_EXPIRATION_TIME), controller.getAllTags);

router.get("/cats", cache(CACHE_EXPIRATION_TIME), controller.getAllCats);

router.get("/cats/filter", controller.filterCats);

router.get("/cats/match", controller.matchCats);

module.exports = router;
