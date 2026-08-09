# syntax=docker/dockerfile:1.7

ARG BUN_VERSION=1.3.14
ARG NODE_VERSION=24.15.0
ARG BUILD_CACHE_SCOPE=shared

FROM oven/bun:${BUN_VERSION}-alpine AS deps

WORKDIR /app

ARG BUILD_CACHE_SCOPE

COPY package.json bun.lock ./
COPY patches ./patches
RUN --mount=type=cache,id=scoresaber-website-${BUILD_CACHE_SCOPE}-bun,target=/root/.bun/install/cache,sharing=locked \
    bun install --frozen-lockfile

FROM deps AS builder

WORKDIR /app

COPY . .

ARG BUILD_CACHE_SCOPE
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_ARCVIEWER_URL
ARG NEXT_PUBLIC_LUDUS_URL
ARG DEBUG_REACT_SCAN
ARG DEBUG_BREAKPOINTS
ARG DEBUG_PAGE_BACKGROUND
ARG API_URL

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_ARCVIEWER_URL=${NEXT_PUBLIC_ARCVIEWER_URL}
ENV NEXT_PUBLIC_LUDUS_URL=${NEXT_PUBLIC_LUDUS_URL}
ENV DEBUG_REACT_SCAN=${DEBUG_REACT_SCAN}
ENV DEBUG_BREAKPOINTS=${DEBUG_BREAKPOINTS}
ENV DEBUG_PAGE_BACKGROUND=${DEBUG_PAGE_BACKGROUND}
ENV API_URL=${API_URL}
ENV NODE_ENV=production

RUN --mount=type=cache,id=scoresaber-website-${BUILD_CACHE_SCOPE}-vite,target=/app/node_modules/.vite,sharing=locked \
    bun run build

FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_ARCVIEWER_URL
ARG NEXT_PUBLIC_LUDUS_URL
ARG DEBUG_REACT_SCAN
ARG DEBUG_BREAKPOINTS
ARG DEBUG_PAGE_BACKGROUND
ARG API_URL

ENV NODE_ENV=production \
    PORT=4000 \
    HOSTNAME=0.0.0.0 \
    API_URL=${API_URL} \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_ARCVIEWER_URL=${NEXT_PUBLIC_ARCVIEWER_URL} \
    NEXT_PUBLIC_LUDUS_URL=${NEXT_PUBLIC_LUDUS_URL} \
    DEBUG_REACT_SCAN=${DEBUG_REACT_SCAN} \
    DEBUG_BREAKPOINTS=${DEBUG_BREAKPOINTS} \
    DEBUG_PAGE_BACKGROUND=${DEBUG_PAGE_BACKGROUND}

COPY --from=builder --chown=node:node /app/.output ./.output

USER node

EXPOSE 4000

HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=5 \
  CMD node -e "const socket = require('node:net').connect(process.env.PORT || 4000, '127.0.0.1'); socket.setTimeout(2000); socket.on('connect', () => { socket.destroy(); process.exit(0) }); socket.on('timeout', () => { console.error('listener timed out'); socket.destroy(); process.exit(1) }); socket.on('error', (error) => { console.error(error.message); process.exit(1) })"

CMD ["node", ".output/server/index.mjs"]
