import express from "express";
import fetch from "node-fetch";
import { MongoClient } from "mongodb";

const router = express.Router();
const client = new MongoClient(process.env.MONGO_URI);

async function isLinkWorking(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchAnimeInfo(id) {
  const res = await fetch(`https://api.consumet.org/meta/anilist/info/${id}`);
  return res.json();
}

async function fetchEpisodeUrl(epId) {
  const res = await fetch(`https://api.consumet.org/meta/anilist/watch/${epId}`);
  return res.json();
}

router.post("/", async (req, res) => {
  const { id, ids } = req.body;
  const animeIds = ids || (id ? [id] : []);
  if (animeIds.length === 0) return res.status(400).json({ error: "No AniList IDs provided" });

  const results = [];
  try {
    await client.connect();
    const db = client.db("titu");

    for (let animeId of animeIds) {
      const anime = await fetchAnimeInfo(animeId);
      if (!anime) continue;

      const episodes = [];
      for (let ep of anime.episodes) {
        const watch = await fetchEpisodeUrl(ep.id);
        const url = watch.sources?.[0]?.url;
        if (url && await isLinkWorking(url)) {
          episodes.push({ number: ep.number, title: ep.title, url });
        }
      }

      const category = anime.type || "Unknown";
      const genres = anime.genres || [];

      await db.collection("titu").updateOne(
        { id: anime.id },
        { $set: {
            id: anime.id,
            title: anime.title.romaji || anime.title.english,
            description: anime.description,
            poster: anime.image,
            category,
            genres,
            episodes
        }},
        { upsert: true }
      );

      results.push({ id: anime.id, title: anime.title.romaji, episodesImported: episodes.length });
      console.log(`Imported: ${anime.title.romaji}, Episodes: ${episodes.length}`);
    }

    res.status(200).json({ message: "Import completed", results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

export default router;