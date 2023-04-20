const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_BASE_URL = process.env.API_BASE_URL;

router.get("/tags", async (req, res) => {
    try {
        // Fetch all tags
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

    // Enforce queries
    if (!filtertag || !omit || !total) {
        return res.status(400).json({
            error: "Bad Request",
            messsage: "filtertag, omit and total parameters are required",
        });
    }

    // Construct the params
    try {
        const params = new URLSearchParams({
            ["tags"]: filtertag,
            ["skip"]: omit,
            ["limit"]: total,
        });

        // Fetch all cats that correspond to the params
        const response = await axios.get(`${API_BASE_URL}/api/cats?${params}`);
        const tags = await response.data;

        res.status(200).json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});

router.get("/cats/match", async (req, res) => {
    const { string } = req.query;
    if (!string || typeof string !== "string") {
        res.status(400).json({
            error: "Invalid query parameter. 'substr' should be a non-empty string",
        });
        return;
    }

    try {
        // Fetch all tags
        const response1 = await axios.get(`${API_BASE_URL}/api/tags`);
        const tags = response1.data;

        // Filter tags based on substr
        const filteredTags = tags.filter((tag) => tag.includes(string));

        // Fetch cats that have any of the filtered tags
        const params = new URLSearchParams({ tags: filteredTags.join(",") });
        const response2 = await axios.get(`${API_BASE_URL}/api/cats?${params}`);
        const cats = response2.data;

        // Construct the response object
        const responseObj = {
            tags: filteredTags,
            count: cats.length,
            cats,
        };

        res.status(200).json(responseObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
