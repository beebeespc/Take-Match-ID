const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const app = express();
const PORT = 9135

app.use(cors());
app.use(express.json());

app.get("/proxy", async (req, res) => {
    const targetUrl = req.query.url; 
    const headers = JSON.parse(req.query.headers || "{}"); 

    if (!targetUrl) {
        return res.status(400).json({ error: "Missing 'url' query parameter" });
    }

    try {
        const response = await fetch(targetUrl, { headers });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching API:", error);
        res.status(500).json({ error: "Error fetching API" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});