 const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();

// Home
app.get("/", (req, res) => {
  res.send("ANTI DARKTUBE — ONLINE");
});

// DESCARGA PARA ATAJOS
app.get("/download", (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).send("Missing ?url=");

  console.log("Downloading for Shortcuts:", videoURL);

  const file = "/tmp/video.mp4";
  const command = `yt-dlp -f mp4 -o ${file} "${videoURL}"`;

  exec(command, (err) => {
    if (err) return res.status(500).send("Download failed");

    res.download(file, "anti_darktube.mp4", (err) => {
      fs.unlink(file, () => {}); // cleanup
    });
  });
});

// STREAM UNIVERSAL (NAVEGADOR)
app.get("/stream", (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).send("Missing ?url=");

  console.log("Streaming:", videoURL);

  const command = `yt-dlp -f mp4 -o - "${videoURL}"`;

  const process = exec(command, { maxBuffer: 1024 * 1024 * 50 });

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", 'attachment; filename="anti_darktube.mp4"');
  res.setHeader("Transfer-Encoding", "chunked");

  process.stdout.pipe(res);
});

// Fly.io port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`ANTI DARKTUBE running on port ${PORT}`);
});                 
