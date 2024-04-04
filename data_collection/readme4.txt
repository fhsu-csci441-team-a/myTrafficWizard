# Data Collection Scripts for MyTrafficWizard

This document provides instructions on how to run the data collection scripts for the MyTrafficWizard application.

This will create the scheduled_trips table and insert mock data into the new table.

## Requirements

Before running the scripts, you must have PostgreSQL installed and properly configured on your system.

## Setup

- Ensure that PostgreSQL is running on your machine.
- Place the data collection script in an accessible directory.

## Running the Scripts [command line]

To run the data collection scripts, you can use the `psql` command-line utility provided by PostgreSQL.

Open your command-line interface and navigate to the directory where your script is located.

Execute the script using the following command:

```bash
psql -d database_name -U user_name -f data_creation.sql

## Running the Scripts [database client]

To run the data collection scripts, you can simply open the .sql file in your database client (for example pgadmin) and

hit the execute button to run all the statements. 