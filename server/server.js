const express = require("express");
const app = express();
const catRoutes = require("./routes/cats");

const PORT = 3000;
const HOST = "localhost";

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use("/tags", catRoutes);

app.listen(PORT, HOST, () => {
    console.log(`Proxy Started at ${HOST}:${PORT}`);
});
