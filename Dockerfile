FROM node:20-alpine AS base

# Dependências
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Passar variaveis de ambiente caso o Next.js precise rodar algum pré-render no build
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Desabilita telemetria para build mais rápido
ENV NEXT_TELEMETRY_DISABLED 1

# Compila o app (standalone configuration no next.config.ts)
RUN npm run build

# Runner (Produção)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Configura permissões para a pasta otimizada
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copia a pasta standalone que o next gera automaticamente
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
