const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
require("dotenv").config();

const app = express();

const PORT = 3000;
const HOST = "localhost";
const API_BASE_URL = process.env.API_BASE_URL;

app.use(morgan("dev"));

app.get("/tags", async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}api/tags`);
        const tags = response.data;
        res.json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Inernal Server Error" });
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Proxy Started at ${HOST}:${PORT}`);
});
