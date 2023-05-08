FROM node:lts-alpine

WORKDIR /usr/src/app

RUN mkdir -p /opt/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]