#!/bin/bash
# Will be moved into docker some day over the rainbow
docker run \
    --name mongo \
    -p 27017:27017 \
    --env MONGO_INITDB_ROOT_USERNAME=root \
    --env MONGO_INITDB_ROOT_PASSWORD=example \
    -d mongo