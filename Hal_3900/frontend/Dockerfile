FROM node:11

COPY . /app/web
WORKDIR /app/web

RUN npm install
RUN npm run build

EXPOSE 8080

ENTRYPOINT npm run serve