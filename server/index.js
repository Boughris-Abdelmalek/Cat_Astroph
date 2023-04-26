const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8000");
    next();
});

// Routes
app.use("/api/v1", require("./routes"));

// Enable cors
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
