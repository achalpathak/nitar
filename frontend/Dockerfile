FROM node:18-alpine
WORKDIR /application
COPY package.json .
RUN apk update && apk add bash
RUN yarn install
COPY . .
EXPOSE 5173