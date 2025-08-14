import 'dotenv/config';
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const response = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(q)}`, {
      headers: { Authorization: `Bearer ${process.env.GENIUS_API_TOKEN}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
