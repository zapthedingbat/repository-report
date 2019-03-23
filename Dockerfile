# Build and test
FROM node:10-alpine as build
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install --development
COPY --chown=node:node . .
RUN npm run test

# Production
FROM node:10-alpine as production
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
ARG NPM_TOKEN
ENV NODE_ENV 'production'
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm ci --production --no-audit
COPY --chown=node:node ./src ./src
CMD ["node", "index.js"]
