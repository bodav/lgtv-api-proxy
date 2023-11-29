FROM node:alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM node:alpine
WORKDIR /app
COPY package.json ./
ENV NODE_ENV=production
RUN npm install
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD npm start