const express = require("express");
const { exec } = require("child_process");

const app = express();

// Home
app.get("/", (req, res) => {
  res.send("ANTI DARKTUBE — ONLINE");
});

// STREAM UNIVERSAL
app.get("/stream", (req, res) => {
  const videoURL = req.query.url;

  if (!videoURL) {
    return res.status(400).send("Missing ?url=");
  }

  console.log("Downloading:", videoURL);

  const command = `yt-dlp -f mp4 -o - "${videoURL}"`;

  const process = exec(command, {
    maxBuffer: 1024 * 1024 * 50, // 50 MB
  });

  // Headers correctos
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="anti_darktube.mp4"'
  );
  res.setHeader("Transfer-Encoding", "chunked");

  // Stream directo
  process.stdout.pipe(res);

  process.stderr.on("data", (err) => {
    console.log("yt-dlp error:", err.toString());
  });

  process.on("close", () => {
    console.log("Stream finished");
  });
});

// Puerto Fly.io
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`ANTI DARKTUBE server running on port ${PORT}`);
});
