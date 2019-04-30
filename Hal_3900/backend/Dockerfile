FROM node:11

COPY . /app/web
WORKDIR /app/web/server

RUN npm install
RUN npm rebuild

EXPOSE 9447
ENV PROD='1'
ENV GOOGLE_APPLICATION_CREDENTIALS="/app/web/server/DFServiceAccount_wordbag.json"
ENTRYPOINT npm run start