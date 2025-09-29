import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "titu";

// Middleware: log each request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health Checker
app.get("/api/health", async (req, res) => {
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    console.log("✅ MongoDB Connected");
    res.json({ status: "ok", message: "MongoDB connected" });
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    res.status(500).json({ status: "error", message: "MongoDB connection failed", error: err.message });
  } finally {
    await client.close();
  }
});

// Get all anime
app.get("/api/anime", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const anime = await db.collection("titu").find().toArray();
    console.log("Fetched all anime:", anime.length, "records");
    res.json(anime);
  } catch (err) {
    console.error("Error fetching anime:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get anime by ID
app.get("/api/anime/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const anime = await db.collection("titu").findOne({ id: parseInt(req.params.id) });
    console.log("Fetched anime by ID:", req.params.id);
    res.json(anime);
  } catch (err) {
    console.error("Error fetching anime by ID:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Search by genre/category
app.get("/api/anime/search", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const query = {};
    if (req.query.genre) query.genres = req.query.genre;
    if (req.query.category) query.category = req.query.category;

    const anime = await db.collection("titu").find(query).toArray();
    console.log("Search results:", query, "found", anime.length, "records");
    res.json(anime);
  } catch (err) {
    console.error("Error searching anime:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
