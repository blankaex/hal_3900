FROM node:11

COPY . /app/web
WORKDIR /app/web

RUN npm install

EXPOSE 9447
ENV PRODUCTION='1'

ENTRYPOINT npm run start