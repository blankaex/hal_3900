## Connect to running and set up instance

```
make
```

## To run for development

> Make sure you are running latest node version

> Make sure you have docker and docker-compose installed

_launch the database_
```
cd database
docker build -t mongodb .
docker run -p 27017:27017 -d mongodb
```

if you do not have access to docker please use the make command above to ssh into our aws box with the app set up and running. Note you may need to do `sudo su -` to elevae to root to get access to docker commands. 

_in one terminal launch frontend_
```
cd frontend
npm install // if you haven't already
npm run serve
```

_in one terminal launch backend_
```
cd backend
npm install // if you haven't already
EXPORT GOOGLE_APPLICATION_CREDENTIALS="backend/DFServiceAccount.json"
npm run dev
```

## To run for production

> Again this requires docker

```
docker-compose build
docker-compose up
```