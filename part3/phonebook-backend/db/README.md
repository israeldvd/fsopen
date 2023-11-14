# Running a local instance of MongoDB inside Docker container

## Setting important variables

Define variables necessary make connection. You might want to create a file named `.env.local` (that named under `env_file` of docker-compose file) and place there the necessary variables to run the instance having customized root user and password, at the start.

Example directly related to the container variables are placed in [`.env.local.example`](./.env.local.example).

## Usage

```shell
docker-compose -f docker-compose.dev.yml up -d # or use docker compose, for v2
```

This will create a mongodb image if there is not one and run the container with the mongodb instance. To run an app with it, as it is forwarded to port 27017, you must define to your `.env.*` file (or script) according to your project. You may use the [this `.env` file](../.env.local.example) as an example.
