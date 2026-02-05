#Stage 1: Build

FROM node:20-alpine AS builder
# from the base image node 

WORKDIR /backend
# working directory define 

COPY package*.json ./

RUN npm ci

COPY . .
#copy all the file for the host to working directory 

RUN npm run build



#Stage 2: Production 
FROM node:20-alpine AS runner 

WORKDIR /backend

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

# Copy compiled JavaScript from builder
COPY --from=builder /backend/build ./build

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "build/server.js"]

