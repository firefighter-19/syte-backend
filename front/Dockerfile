FROM node:20 AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production

EXPOSE 5173 8080

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run build && npx serve -s dist -l 8080; else npm run dev --host; fi"]
