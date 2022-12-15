FROM node:18-alpine
WORKDIR /application
COPY package.json .
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 5173