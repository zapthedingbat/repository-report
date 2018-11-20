FROM node:10-alpine
# RUN addgroup -S app && adduser -S -G app app
WORKDIR /home/app

RUN apk --no-cache add make python curl-dev g++
RUN CFLAGS=-w CXXFLAGS=-w BUILD_ONLY=true npm i nodegit
COPY package*.json ./
RUN npm install

COPY ./src ./src

ENV NODE_PORT 3000
EXPOSE 3000
CMD ["node", "src/index"]
