FROM node:18-alpine
WORKDIR /app
COPY package.json server.js ./
COPY index.html ./
EXPOSE 8000
CMD ["node", "server.js"]
