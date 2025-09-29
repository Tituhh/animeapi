import express from "express";
import animeRouter from "./api/anime.js";
import animeIdRouter from "./api/anime/[id].js";
import importRouter from "./api/import.js";
import searchRouter from "./api/search.js";

const app = express();
app.use(express.json());

// Routes
app.use("/api/anime", animeRouter);
app.use("/api/anime", animeIdRouter);
app.use("/api/import", importRouter);
app.use("/api/anime/search", searchRouter);

const PORT = process.env.PORT || 3000;
