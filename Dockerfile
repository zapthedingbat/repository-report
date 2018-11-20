FROM node:10-alpine
WORKDIR /home/app

RUN apk add git

RUN addgroup -S app && adduser -S -G app app
USER app

COPY package*.json ./
RUN npm install

COPY ./src ./src

ENV NODE_PORT 3000
EXPOSE 3000
CMD ["node", "src/index"]
