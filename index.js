const express = require("express");
const { spawn } = require("child_process");

const app = express();

app.get("/", (req, res) => {
  res.send("ANTI DARKTUBE — ONLINE");
});

app.get("/stream", (req, res) => {
  const videoURL = req.query.url;

  if (!videoURL) {
    return res.status(400).send("Missing ?url=");
  }

  console.log("Streaming:", videoURL);

  // Usar spawn en vez de exec → STREAM REAL
  const process = spawn("yt-dlp", [
    "-f", "mp4",
    "-o", "-",
    videoURL
  ]);

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="anti_darktube.mp4"'
  );

  process.stdout.pipe(res);

  process.stderr.on("data", (data) => {
    console.error("yt-dlp error:", data.toString());
  });

  process.on("close", () => {
    console.log("Stream finished");
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`ANTI DARKTUBE server running on port ${PORT}`);
});
