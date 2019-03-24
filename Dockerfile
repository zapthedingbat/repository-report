# Build and test
FROM node:10-alpine as builder
LABEL image=builder
WORKDIR /home/node/app
COPY package*.json ./
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install --development
COPY ./ ./
ENV CI=true
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
    npm ci --production --no-audit && \
    rm package*.json
COPY --chown=node:node --from=builder /home/node/app/src ./src
CMD ["node", "src/index.js"]
