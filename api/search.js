import express from "express";
import { MongoClient } from "mongodb";

const router = express.Router();
const client = new MongoClient(process.env.MONGO_URI);

router.get("/", async (req, res) => {
  const { genre, category } = req.query; // ?genre=Action&category=TV
  try {
    await client.connect();
    const db = client.db("titu");
    const query = {};
    if (genre) query.genres = genre;
    if (category) query.category = category;
    
    const anime = await db.collection("titu").find(query).toArray();
    res.status(200).json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

export default router;