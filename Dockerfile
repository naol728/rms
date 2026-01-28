# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./

RUN npm ci || npm i

COPY . .

ENV VITE_API_PROXY_TARGET=http://web

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]


