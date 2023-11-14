# Running a local instance of MongoDB inside Docker container

## Setting important variables

Define variables necessary make connection. You might want to create a file named `.env.local` (that named under `env_file` of docker-compose file) and place there the necessary variables to run the instance having customized root user and password, at the start.

Example variables are placed in [`.env.local.example`](./.env.local.example). However, to run a node script you must refer to your `.env.*` file.

## Usage

```shell
docker-compose -f docker-compose.dev.yml up
```

This will create a mongodb image if there is not one and run the container with the mongodb instance.
