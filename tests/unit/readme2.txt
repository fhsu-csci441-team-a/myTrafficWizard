# Running Unit Tests for MyTrafficWizard

This document provides the instructions to run unit tests using Jest for the MyTrafficWizard app.

## Requirements
Before running the tests, make sure you have the following installed

* Node.js
* NPM
* .env file with necessary secrets


## Cloning the repo
You can clone the repo to your local machine by first navigating to the directory you want store the files and using the following command:
```
git clone https://github.com/fhsu-csci441-team-a/myTrafficWizard.git
```

## Setup
Before running the tests, run the following command to install all dependencies (including the Jest testing package)
```bash
npm install
```

## Running the Tests

To run all unit tests, navigate to the root directory of the project and use the following command:

```bash
npm test tests/unit
```

This will execute all test suites that are present in the `tests/unit` directory.

## Running Specific Tests

If you want to run a specific test file, you can do so by specifying the test file's path in the command. For example, to run tests for the `TravelController`, use the command:

```bash
npm test tests/unit/controllers/travelController.test.js
```

Replace `travelController.test.js` with the desired test file's name to run different tests.

## Test Suites

The following test suites are available (the names of the files correspond to the entity they are testing):

- gmailController.test.js
- homeController.test.js
- slackBotController.test.js
- travelController.test.js
- addressModel.test.js
- messageModel.test.js
- scheduledTripsModel.test.js
- travelIncidentModel.test.js
- travelTimeModel.test.js
- baseFetchRetry.test.js

Additional test suites can be added to the respective directories under the `tests/unit` folder and Jest will pick them up when running the tests.

## Troubleshooting
The most common issue when running the tests is missing a .env file. This file contains all of our secrets used for API calls and database
connections. Please contact myTrafficWizard@gmail.com with a request for the .env file.

## Continuous Integration

If you have a CI/CD pipeline set up, make sure to include the `npm test` command in your build process to run tests automatically.