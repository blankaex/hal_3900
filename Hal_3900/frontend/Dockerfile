FROM node:11

COPY . /app/web
WORKDIR /app/web/dist

RUN npm install
RUN npm run build

EXPOSE 8080

ENTRYPOINT python3 -m http.server 8080