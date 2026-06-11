FROM node:18-alpine

RUN apk add --no-cache \
    python3 \
    gcc \
    g++ \
    openjdk11-jdk \
    && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]