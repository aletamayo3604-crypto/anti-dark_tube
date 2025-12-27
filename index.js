const express = require("express");
const { spawn } = require("child_process");

const app = express();

app.get("/", (req, res) => {
  res.send("ANTI DARKTUBE — ONLINE");
});

app.get("/stream", (req, res) => {
  const url = req.query.url;

  if (!url) return res.status(400).send("Missing url");

  console.log("Downloading:", url);

  const args = [
    "--no-warnings",
    "--prefer-insecure",
    "--no-check-certificate",
    "--user-agent",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)",
    "-f",
    "mp4",
    "-o",
    "-",
    url,
  ];

  const ytdlp = spawn("yt-dlp", args);

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="anti_darktube.mp4"'
  );

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on("data", (d) => console.log("yt-dlp:", d.toString()));
  ytdlp.on("close", () => console.log("STREAM FINISHED"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("ANTI DARKTUBE running on", PORT);
});
