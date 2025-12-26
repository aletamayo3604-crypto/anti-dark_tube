# Base oficial Node 18
FROM node:18-slim

# Necesario para instalar dependencias de yt-dlp
RUN apt-get update && apt-get install -y \
    python3 \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar yt-dlp (última versión estable)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp \
    && chmod +x /usr/local/bin/yt-dlp

# Carpeta del proyecto
WORKDIR /app

# Copiar solo lo necesario primero para mejor cache
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install --production

# Copiar todo el código
COPY . .

# Puerto que usará Fly.io
EXPOSE 8080

# Comando de ejecución
CMD ["node", "index.js"]
