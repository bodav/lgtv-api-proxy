FROM node:alpine

WORKDIR /app
ADD package.json /app

RUN npm install --production

COPY ./dist /app

CMD ["node", "app.js"]

EXPOSE 3000