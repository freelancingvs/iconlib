import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const UPLOADS_DIR = process.env.VERCEL ? "/tmp/uploads" : "uploads";
const DATA_DIR = process.env.VERCEL ? "/tmp/data" : "data";
const ICONS_DIR = path.join(DATA_DIR, "icons");
const DB_PATH = path.join(DATA_DIR, "icons.json");

// Ensure directories exist
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ICONS_DIR)) fs.mkdirSync(ICONS_DIR, { recursive: true });

const upload = multer({ dest: UPLOADS_DIR });

// Initialize physical JSON DB if not exists
let iconsDB = [];
if (fs.existsSync(DB_PATH)) {
  iconsDB = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
} else {
  // Seed defaults on initial run
  const defaults = [
    {
      id: uuidv4(),
      name: "star",
      tags: "star, favorite, rating, bookmark",
      svg_code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    },
    {
      id: uuidv4(),
      name: "heart",
      tags: "heart, love, like, favorite",
      svg_code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    },
    {
      id: uuidv4(),
      name: "home",
      tags: "home, house, main, dashboard",
      svg_code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    },
    {
      id: uuidv4(),
      name: "search",
      tags: "search, find, magnify, look",
      svg_code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    },
    {
      id: uuidv4(),
      name: "settings",
      tags: "settings, gear, config, preferences",
      svg_code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    },
    {
      id: uuidv4(),
      name: "bell",
      tags: "bell, notification, alert, ring",
      svg_code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    },
    {
      id: uuidv4(),
      name: "user",
      tags: "user, person, profile, account",
      svg_code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    },
    {
      id: uuidv4(),
      name: "mail",
      tags: "mail, email, message, envelope",
      svg_code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    },
  ];

  iconsDB = defaults.map(icon => ({ ...icon, created_at: new Date().toISOString() }));
  fs.writeFileSync(DB_PATH, JSON.stringify(iconsDB, null, 2));

  // Also physically write default SVGs
  iconsDB.forEach(icon => {
    fs.writeFileSync(path.join(ICONS_DIR, `${icon.id}.svg`), icon.svg_code);
  });
}

function saveDB() {
  fs.writeFileSync(DB_PATH, JSON.stringify(iconsDB, null, 2));
}

// Upload icon
app.post("/upload", upload.single("icon"), async (req, res) => {
  try {
    const { name, tags } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const svgCode = fs.readFileSync(req.file.path, "utf8");
    if (!svgCode.includes("<svg")) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Invalid SVG file" });
    }

    const newIcon = {
      id: uuidv4(),
      name,
      tags,
      svg_code: svgCode,
      created_at: new Date().toISOString()
    };
    
    // Save to array and physical JSON
    iconsDB.unshift(newIcon);
    saveDB();

    // Move uploaded SVG to physical data/icons directory permanently
    fs.renameSync(req.file.path, path.join(ICONS_DIR, `${newIcon.id}.svg`));
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all icons or search
app.get("/icons", (req, res) => {
  const search = req.query.search?.toLowerCase() || "";
  
  if (!search) {
    return res.json(iconsDB);
  }
  
  const filtered = iconsDB.filter(icon => 
    (icon.name && icon.name.toLowerCase().includes(search)) || 
    (icon.tags && icon.tags.toLowerCase().includes(search))
  );
  
  res.json(filtered);
});

// Delete icon
app.delete("/icons/:id", (req, res) => {
  const { id } = req.params;
  
  iconsDB = iconsDB.filter(icon => icon.id !== id);
  saveDB();
  
  const svgPath = path.join(ICONS_DIR, `${id}.svg`);
  if (fs.existsSync(svgPath)) {
    fs.unlinkSync(svgPath);
  }

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✦ SVG Icon Library running on http://localhost:${PORT}`));

export default app;
