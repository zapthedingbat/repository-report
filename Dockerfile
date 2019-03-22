# Build and test
FROM node:10-alpine as build
RUN apk add git
WORKDIR /var/src/app
RUN addgroup -S app && adduser -S -G app app
USER app
COPY package.json package-lock.json ./
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install --development
COPY ./src ./src
RUN npm run test

# Production
FROM node:10-alpine as production
WORKDIR /var/src/app
ARG NPM_TOKEN
ENV NODE_ENV 'production'
COPY package.json package-lock.json ./
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm ci --production --no-audit
COPY ./src ./src
CMD ["node", "index.js"]
