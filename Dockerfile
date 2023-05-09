FROM node:lts-alpine

WORKDIR /usr/src/app

RUN mkdir -p /opt/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start:dev"]