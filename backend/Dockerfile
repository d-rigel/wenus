FROM node:18.12.1-alpine

WORKDIR "/app"

COPY ./package.json ./

RUN npm install

COPY . .

RUN npm run compile

CMD ["npm", "run", "start:build"]

