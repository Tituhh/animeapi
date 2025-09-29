import express from "express";
import { MongoClient } from "mongodb";

const router = express.Router();
const client = new MongoClient(process.env.MONGO_URI);

router.get("/", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("titu");
    const anime = await db.collection("titu").find().toArray();
    res.status(200).json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

export default router;