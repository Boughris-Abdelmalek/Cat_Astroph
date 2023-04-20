const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_BASE_URL = process.env.API_BASE_URL;

router.get("/tags", async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/tags`);
        const tags = await response.data;

        res.status(200).json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});

router.get("/cats/filter", async (req, res) => {
    
    const { filtertag, omit, total } = req.query;

    if (!filtertag || !omit || !total) {
        return res
            .status(400)
            .json({
                error: "Bad Request",
                messsage: "filtertag, omit and total parameters are required",
            });
    }

    try {
        const params = new URLSearchParams({
            ["tags"]: filtertag,
            ["skip"]: omit,
            ["limit"]: total,
        });

        const response = await axios.get(`${API_BASE_URL}/api/cats?${params}`);
        const tags = await response.data;

        res.status(200).json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});

module.exports = router;
