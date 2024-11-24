FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM base AS development
WORKDIR /app
COPY . .
RUN npm install --only=development
RUN npm install -g nodemon
EXPOSE 3000
CMD ["sh", "-c", "npm run start:dev"]

FROM base AS production
WORKDIR /app
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["sh", "-c", "npm run typeorm:run-migrations && npm run start:prod"]
