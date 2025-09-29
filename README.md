

# 📺 Anime Streaming API

A simple **Anime API Bridge** using **Node.js + Express + MongoDB**.  
It fetches data from external sources (like AniList/Consumet) and saves them into MongoDB.  
Frontend can consume the API for building streaming websites (React/Next.js/WordPress etc.).

---

## 🚀 Features
- Fetch & Save anime into MongoDB  
- Store **category (TV, Movie, OVA, Special)**  
- Store **genres (Action, Romance, Shounen, etc.)**  
- Store episodes with streaming links  
- REST API to search/filter anime  
- Deploy on **Vercel (API)** + any other frontend hosting  

---

## 🗂️ MongoDB Schema

```json
{
  "id": 1535,
  "title": "Naruto",
  "description": "Naruto Uzumaki is a young ninja...",
  "poster": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/1535.jpg",
  "category": "TV",
  "genres": ["Action", "Adventure", "Shounen"],
  "episodes": [
    { "number": 1, "title": "Enter Naruto Uzumaki!", "url": "https://stream.server/vid1.m3u8" },
    { "number": 2, "title": "My Name is Konohamaru!", "url": "https://stream.server/vid2.m3u8" }
  ]
}


---

⚙️ Setup

1. Clone Project

git clone https://github.com/yourname/anime-streaming-api.git
cd anime-streaming-api

2. Install Dependencies

npm install

3. Add .env

MONGO_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net
PORT=3000

4. Run Import Script (Fetch & Save to DB)

node import.js

5. Start API

npm start


---

📡 Endpoints

🔹 Get All Anime

GET /api/anime

🔹 Get Anime by ID

GET /api/anime/:id

🔹 Search by Genre / Category

GET /api/anime/search?genre=Action&category=TV

📌 Example Response:

[
  {
    "id": 1535,
    "title": "Naruto",
    "category": "TV",
    "genres": ["Action", "Adventure"],
    "poster": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/1535.jpg"
  }
]


---

🌍 Deployment

Backend (API) → Vercel

Frontend → Any hosting (Netlify, Vercel, InfinityFree, etc.)

Just update frontend fetch URLs →
https://your-vercel-app.vercel.app/api/anime



---

✅ Example Frontend Usage

fetch("https://your-vercel-app.vercel.app/api/anime/search?genre=Action&category=TV")
  .then(res => res.json())
  .then(data => console.log(data));


---

