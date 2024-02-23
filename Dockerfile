FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ENV PORT=3011

EXPOSE 3011

CMD [ "npm", "run", "prod" ]