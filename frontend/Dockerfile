FROM node:18-alpine
WORKDIR /application
COPY package.json .
RUN apk update && apk add bash
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 5173