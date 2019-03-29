# TODO: shift this into the wiki 

## To run for development

> make sure you are running latest node version

_launch the database_
```
cd database
docker build -t mongodb .
docker run -p 27017:27017 -d mongodb
```

_in one terminal launch frontend_
```
cd frontend
npm run install // if you haven't already
npm run serve
```

_in one terminal launch backend_
```
cd backend
npm run install // if you haven't already
EXPORT GOOGLE_APPLICATION_CREDENTIALS="backend/DFServiceAccount.json"
npm run dev
```