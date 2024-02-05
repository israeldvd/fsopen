# Running a local instance of MongoDB inside Docker container

## Setting important variables

Define variables necessary make connection. You might want to create a file named `.env.local` (that named under `env_file` of docker-compose file) and place there the necessary variables to run the instance having customized root user and password, at the start.

Example directly related to the container variables are placed in [`.env.local.example`](./.env.local.example).

## Usage

```shell
docker-compose -f docker-compose.dev.yml up -d # or use docker compose, for v2
```

This will create a mongodb image if there is not one and run the container with the mongodb instance. To run an app with it, as it is forwarded to port 27017, you must define to your `.env.*` file (or script) according to your project. You may use the [this `.env` file](../.env.local.example) as an example.

## Connecting with authentication to the database server

Here you have two options to access the MongoDB (local) server:

1. Running directly from the port mapping.
2. Running from the inside of the container.

### Running directly from the port mapping

Assuming you have installed mongo and added the commands to make a connection, now your shell is able to access the instance directly with:

```shell
# localhost works the same as '127.0.0.1' here
mongosh localhost:27017 --username phonebook-user --authenticationDatabase admin
```

### Running from the inside of the container

After running your container from the image, take the following steps to connect to the MongoDB deployment (the example uses `localMongo` container name):

```shell
# either run 'docker container' (v2)
docker container exec -it localMongo bash

# or 'docker exec' directly
docker exec -it localMongo bash
```

When already inside the conainter, authenticate, enter in the password defined in `.env.local`:

```bash
mongosh --username phonebook-user --authenticationDatabase admin
***
```

These commands are meant for the local composition made in this repository ([`docker-compose.dev.yml`](./docker-compose.dev.yml)). Check the [MongoDB Shell official docs](https://www.mongodb.com/docs/mongodb-shell/) for more.
