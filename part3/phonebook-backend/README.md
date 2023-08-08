# Phonebook backend

This repository contains the backend of the **phonebook** app.

## URI

You can access it by and send requests to the URL <https://dvd-phonebook.fly.dev>.

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
