const express = require("express");
const { spawn } = require("child_process");

const app = express();

// Health check
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

  // yt-dlp → using spawn (NOT exec)
  const yt = spawn("yt-dlp", [
    "-f", "mp4",
    "-o", "-",         // output to stdout
    videoURL
  ]);

  // Headers correctos
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", 'attachment; filename="anti_darktube.mp4"');

  // Pipe binario directo
  yt.stdout.pipe(res);

  yt.stderr.on("data", (err) => {
    console.log("yt-dlp:", err.toString());
  });

  yt.on("close", (code) => {
    console.log("Stream finished with code:", code);
  });
});

// Puerto Fly.io
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ANTI DARKTUBE running on port ${PORT}`);
});
