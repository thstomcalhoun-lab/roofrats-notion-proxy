const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.all("/notion/*", async (req, res) => {
  const path = req.path.replace("/notion", "");
  const token = req.headers["x-notion-token"];
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const response = await fetch(`https://api.notion.com/v1${path}`, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/health", (_, res) => res.json({ status: "ok" }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
