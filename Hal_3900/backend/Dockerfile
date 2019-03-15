FROM node:11

COPY . /app/web
WORKDIR /app/web

RUN npm install

EXPOSE 9447

ENTRYPOINT npm run dev