require("dotenv").config({ path: 'server/.env' });
const axios = require("axios");

const API_BASE_URL = process.env.API_BASE_URL || 3000;

exports.getAllTags = async (req, res) => {
    console.log("getAllTags called");
    try {
        const response = await axios.get(`${API_BASE_URL}/api/tags`);
        console.log("Response from API:", response.data);
        const tags = await response.data;
        console.log(API_BASE_URL);
        res.json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};