# frontend/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# เปิด Port 5173 ของ Vite
EXPOSE 5173

# รัน Vite dev server
CMD [ "npm", "run", "dev", "--", "--host" ]