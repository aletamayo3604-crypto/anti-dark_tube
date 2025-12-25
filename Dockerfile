FROM node:18

RUN apt-get update && apt-get install -y ffmpeg
RUN npm install -g yt-dlp-exec

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 8080
CMD ["npm", "start"]
