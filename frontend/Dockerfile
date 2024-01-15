FROM node:18.12.1

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/App.js"]