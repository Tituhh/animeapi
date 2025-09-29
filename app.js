import { useEffect, useState } from "react";

// MongoDB Health Status Component
function MongoHealth() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    fetch("https://animeapi-one-flax.vercel.app/api/health")
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") setStatus("✅ Connected to MongoDB");
        else setStatus("❌ MongoDB connection failed");
      })
      .catch(err => setStatus("❌ MongoDB not reachable"));
  }, []);

  const color = status.includes("✅") ? "green" : "red";
  return <div style={{ padding: "10px", fontWeight: "bold", color }}>{status}</div>;
}

// Anime List Component
function AnimeList() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://animeapi-one-flax.vercel.app//api/anime")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched anime:", data.length);
        setAnime(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching anime:", err));
  }, []);

  if (loading) return <h2>Loading anime...</h2>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "20px" }}>
      {anime.map(a => (
        <div key={a.id} style={{ background: "#222", padding: "10px", borderRadius: "10px" }}>
          <img src={a.poster} alt={a.title} style={{ width: "100%", borderRadius: "8px" }} />
          <h3>{a.title}</h3>
          <p><b>Category:</b> {a.category}</p>
          <p><b>Genres:</b> {a.genres?.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

// Search Component
function AnimeSearch({ setAnime }) {
  const [genre, setGenre] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    const query = `?genre=${genre}&category=${category}`;
    fetch(`https://animeapi-one-flax.vercel.app/api/anime/search${query}`)
      .then(res => res.json())
      .then(data => {
        console.log("Search results:", data.length);
        setAnime(data);
      })
      .catch(err => console.error("Search error:", err));
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
      <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

// Main App
function App() {
  const [anime, setAnime] = useState([]);

  return (
    <div style={{ padding: "20px", background: "#111", color: "#fff" }}>
      <h1>Anime Streaming Dashboard</h1>
      <MongoHealth />
      <AnimeSearch setAnime={setAnime} />
      <AnimeList anime={anime} />
    </div>
  );
}

export default App;
