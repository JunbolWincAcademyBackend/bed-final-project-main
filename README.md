<<<<<<< HEAD

# BED Final Project Starter

This repository contains starter code for the Bookings project.

## How to get started

You can clone the repo, install and run the app with the following commands:

```plaintext
npm install
npm run dev
```

## Starting the App

To start the app, follow these steps:

1. Create a `.env` file in the root directory.
2. Replace the values for `AUTH_SECRET_KEY` and `SENTRY_DSN` with your own values.

```plaintext
AUTH_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqZG9lIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzgzNjE2MTEsImV4cCI6MTczODQ3NjgxMX0.Nmmw0eISaanBR_7WQu3-DHuRkF7CQdCPlFXn8WoNDdo

SENTRY_DSN=https://10c8bd4ac08ada86223482b290532c49@o4507764486504448.ingest.de.sentry.io/4508712034828368
```

## Running tests

Tests are created using Newman (the file Booking API.postman_collection.json was use for positive cases the other one had issues), a command-line tool that is able to automate execution of Postman-created tests. Therefore, this command will simulate more or less the same tests that we executed during the course (e.g. test if the "happy case" returns 200 or 201 status code, or it returns 404 Not found when we are requesting a non-existing ID).

To run the tests, perform the following steps:

1. Start the server. This can usually be done by running `npm run dev` in the folder you want to test.
2. Go to `postman/environments` folder in the repo. It has a content like this:

```json
{
  "id": "f1936dc5-a5da-47d7-8189-045437f96e9e",
  "name": "Local",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://0.0.0.0:3000",
      "type": "default",
      "enabled": true
    }
  ],
  "_postman_variable_scope": "environment",
  "_postman_exported_at": "2023-08-11T05:55:13.469Z",
  "_postman_exported_using": "Postman/10.16.9"
}
```

3. If your server is running on a different port or URL, change the value `http://0.0.0.0:3000` to your server's data (this is the default one though).
4. Run the following command

```plaintext
npm test
```

After this, you will see the test results prompted to the terminal. If you have a look at the `package.json` file, you will see that it executes the collection stored in the `postman` folder of the repo root.

# Important: When dealing with JSON data, please, make sure that you restart the server with `npm run dev` every time you execute tests! This is important because some tests will remove data via DELETE endpoints and that operation cannot be repeated with the same ID again and again.

# bed-final-project-main

Backend Development Final Project:Node-Express API, Prisma/ SQLite

> > > > > > > 3089c4b0a2a7ccdd39465b9c667bd0e93776f431
