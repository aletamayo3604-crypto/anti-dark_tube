import express from "express";
import { exec } from "child_process";

const app = express();

app.get("/", (req, res) => {
  res.send("ANTI DARKTUBE — ONLINE");
});

app.get("/stream", (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).send("Missing ?url=");

  const process = exec(`yt-dlp -f mp4 -o - "${videoURL}"`);

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", 'attachment; filename="anti.mp4"');

  process.stdout.pipe(res);
  process.stderr.on("data", d => console.log("ERR:", d));
});

app.listen(8080, () => console.log("ANTI DarkTube online."));
