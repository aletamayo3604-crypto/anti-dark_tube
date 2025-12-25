import express from "express";
import { exec } from "child_process";

const app = express();

// Home básico
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

  // Ejecutar yt-dlp directamente
  const command = `yt-dlp -f mp4 -o - "${videoURL}"`;

  const process = exec(command, { maxBuffer: 1024 * 1024 * 50 }); // 50MB buffer

  // Set headers de descarga
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", "attachment; filename=anti.mp4");

  // Piping directo hacia el usuario
  process.stdout.pipe(res);

  process.stderr.on("data", (err) => {
    console.log("yt-dlp:", err.toString());
  });

  process.on("close", () => {
    console.log("DONE");
  });
});

// Puerto donde corre
app.listen(8080, () => {
  console.log("ANTI DARKTUBE server running on port 8080");
});
