FROM node:18

# Librerías necesarias para yt-dlp
RUN apt-get update && apt-get install -y python3 ffmpeg curl

# Instalar yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
     -o /usr/local/bin/yt-dlp && chmod +x /usr/local/bin/yt-dlp

WORKDIR /app
COPY package.json .
RUN npm install

COPY . .

CMD ["node", "index.js"]
