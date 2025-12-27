FROM node:18-slim

# Dependencias necesarias
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    libnss3 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Instalar yt-dlp desde pip (versión FULL)
RUN pip3 install -U yt-dlp

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["node", "index.js"]
