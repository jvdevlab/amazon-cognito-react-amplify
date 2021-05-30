FROM node:14.9.0

WORKDIR /app

COPY package.json ./
RUN npm install
COPY public ./public
COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]