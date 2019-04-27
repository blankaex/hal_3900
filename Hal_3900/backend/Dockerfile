FROM node:11

COPY . /app/web
WORKDIR /app/web

RUN npm install

EXPOSE 9447
ENV PRODUCTION='1'
ENV GOOGLE_APPLICATION_CREDENTIALS="/app/web/DFServiceAccount_wordbag.json"
ENTRYPOINT npm run start