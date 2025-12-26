const express = require("express");
const { spawn } = require("child_process");
const app = express();

// ================================
//  HOME
// ================================
app.get("/", (req, res) => {
  res.send("🔥 ANTI-DARK_TUBE — ONLINE 🔥");
});

// ================================
//  UTILITY: VALIDATE URL
// ================================
function checkURL(url) {
  return /^https?:\/\/[^\s]+$/.test(url);
}

// ================================
//  STREAM MP4 (DESCARGA DIRECTA)
// ================================
app.get("/stream", (req, res) => {
  const url = req.query.url;

  if (!url || !checkURL(url)) {
    return res.status(400).send("❌ Missing or invalid ?url=");
  }

  console.log("🎥 STREAMING:", url);

  const ytdlp = spawn("yt-dlp", ["-f", "mp4", "-o", "-", url]);

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="anti-dark_tube_video.mp4"'
  );

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on("data", (data) => {
    console.log("yt-dlp stderr:", data.toString());
  });

  ytdlp.on("close", () => {
    console.log("✔ Stream finished");
    res.end();
  });
});

// ================================
//  DOWNLOAD FILE (MP4 COMPLETO)
// ================================
app.get("/download", (req, res) => {
  const url = req.query.url;

  if (!url || !checkURL(url)) {
    return res.status(400).send("❌ Missing or invalid ?url=");
  }

  console.log("⬇ DOWNLOADING:", url);

  const ytdlp = spawn("yt-dlp", ["-f", "mp4", "-o", "-", url]);

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="anti-dark_tube_full.mp4"'
  );

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on("data", (data) => {
    console.log("yt-dlp stderr:", data.toString());
  });

  ytdlp.on("close", () => {
    console.log("✔ Download finished");
    res.end();
  });
});

// ================================
//  AUDIO ONLY (MP3)
// ================================
app.get("/audio", (req, res) => {
  const url = req.query.url;

  if (!url || !checkURL(url)) {
    return res.status(400).send("❌ Missing or invalid ?url=");
  }

  console.log("🎧 AUDIO EXTRACT:", url);

  const ytdlp = spawn("yt-dlp", ["-x", "--audio-format", "mp3", "-o", "-", url]);

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="anti-dark_tube_audio.mp3"'
  );

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on("data", (data) => {
    console.log("yt-dlp stderr:", data.toString());
  });

  ytdlp.on("close", () => {
    console.log("✔ Audio extraction finished");
    res.end();
  });
});

// ================================
//  METADATA
// ================================
app.get("/info", (req, res) => {
  const url = req.query.url;

  if (!url || !checkURL(url)) {
    return res.status(400).send("❌ Missing or invalid ?url=");
  }

  console.log("🔍 FETCHING INFO:", url);

  const ytdlp = spawn("yt-dlp", ["--dump-json", url]);

  let dataString = "";

  ytdlp.stdout.on("data", (chunk) => {
    dataString += chunk.toString();
  });

  ytdlp.stderr.on("data", (data) => {
    console.log("yt-dlp stderr:", data.toString());
  });

  ytdlp.on("close", () => {
    try {
      const metadata = JSON.parse(dataString);
      res.json(metadata);
    } catch (e) {
      res.status(500).send("❌ Failed to parse metadata");
    }
  });
});

// ================================
//  SERVIDOR
// ================================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 ANTI-DARK_TUBE running on port ${PORT}`);
});
