FROM node:11

COPY . /app/web
WORKDIR /app/web/dist

RUN sed 's/localhost:9447/backend\.hal\-3900\.com/g' /app/web/src/store.ts > tmp.ts
RUN mv tmp.ts /app/web/src/store.ts

RUN npm install
RUN npm run build

EXPOSE 8080
ENTRYPOINT python3 -m http.server 8080