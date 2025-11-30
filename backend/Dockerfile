FROM node:22.20.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

# Copy source code
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
