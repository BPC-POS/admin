FROM node:22.14.0-alpine AS base

RUN apk update && apk upgrade && apk add --no-cache libc6-compat && npm i -g npm@latest
WORKDIR /app

COPY --link package.json yarn.lock* package-lock.json* pnpm-lock.yaml* bun.lockb* ./

RUN npm i --legacy-peer-deps

ENV NODE_ENV=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]