# Phonebook backend

This repository contains the backend of the **phonebook** app. It makes use of _fly.io_ machines, but you could alter to your favorite choice.

## On-line app's URI

You can access it by and send requests to the URL <https://dvd-phonebook.fly.dev>. It is currently up and running.

## Using environment variables

Note that it is necessary to set up environment variables in order to use or test the app correctly. Create or modify the `.env` to having the following:

```shell
PHONE_DB_HOSTNAME=phonebook.replacehere.mongodb.net # as provided by your service
PHONE_DB_USERNAME=username
PHONE_DB_PASSWORD=yourpassword
PHONE_DB_DATABASE=phonebookApp # or as you wish
MONGODB_URI=mongodb+srv://${PHONE_DB_USERNAME}:${PHONE_DB_PASSWORD}@${PHONE_DB_HOSTNAME}/${PHONE_DB_DATABASE}?retryWrites=true&w=majority
```

Or, simply:

```shell
MONGODB_URI=mongodb+srv://username:yourpassword@phonebook.replacehere.mongodb.net/phonebookApp?retryWrites=true&w=majority
```

After clonning this repository, the downloaded code contains everything that is needed to run it, either locally or remotely.

## Run the app locally

With the previous steps completed, run either options from below

```shell
# run the app in development mode
npm run start:full

# do the same, but watching for file changes
npm run dev:full
```

to build the UI (found in [part2 of phonebook](../../part2/phonebook/)) and run the **app** in any mode. Note: this chances `NODE_ENV` according to [CRA customization](https://create-react-app.dev/docs/adding-custom-environment-variables/).

## Building the app to production

Log-in to the fullstack solution provider you has, then deploy the application. In this current setup, you can do that [logging into fly.io](https://fly.io/docs/hands-on/sign-in/).

You should add the database-URI variable to fly.io's secrets list. For example, once defined a file `.env.production.local` (having the contents of the full `MONGODB_URI` variable), type and enter:

```shell
fly secrets import < .env.production.local
```

Alternatively, you are able to configure it in the settings panels of the service provider. Once all is set up, run the complete **deployment script** with:

```shell
npm run deploy:full
```
