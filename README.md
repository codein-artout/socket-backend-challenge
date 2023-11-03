Real-Time Weather Data Processing System (Backend)
==================================================

This documentation provides an overview of the backend for a real-time weather data processing system developed using Node.js and TypeScript. The system collects, processes, and provides real-time updates on weather data from various sensors. It includes basic user authentication, data collection, real-time data processing, API endpoints, data persistence, and testing.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Folder Structure](#folder-structure)
3. [API Project Structure](#api-project-structure)
4. [Middleware and Services](#middleware-and-services)
5. [API Routes](#api-routes)
6. [Database Schema](#database-schema)
7. [Message Broker Configuration](#message-broker-configuration)
8. [Authentication](#authentication)
9. [Testing Structure](#testing-structure)
10. [Improvements](#improvements-before-prod-release)

Project Setup
-------------

### Requirements

To run this project, you need to meet the following requirements:

- **Node.js and npm**: Ensure that you have Node.js and npm (Node Package Manager) installed on your system.

- **Redis Server**: You should have access to an online Redis server. The credentials for this Redis server should be saved in a `.env` file. If you don't have one, you can use the Redis server provided by the project owner.

- **Postgres Database**: You can choose between using a local instance of Postgres running in a Docker container or replacing the credentials in the `.env` file with your own Postgres server. Here are the instructions for running Postgres in a Docker container:

  ```bash
  # Pull the official Postgres Docker image
  docker pull postgres
  
  # Run a Postgres container with these credentials if you don't wanna update `.env` file
  docker run --name some-postgres \
    -e POSTGRES_USER=postgresUser \
    -e POSTGRES_PASSWORD=postgresPW \
    -e POSTGRES_DB=postgres \
    -p 5455:5432 \
    -d postgres

### Installation

1. Clone the repository to your local machine:

    ```
    git clone https://github.com/codein-artout/socket-backend-challenge.git
    ```

2. Navigate to the project directory:

    ```
    cd <project-directory>
    ```

#### Weather API

1. Navigate to the weather api directory:

    ```
    cd Weather API
    ```

2. Install project dependencies:

    ```
    npm install
    ```

3. Start the application:

    ```
    npm run start
    ```

#### Sensor Factory

1. Navigate to the weather api directory:

    ```
    cd Sensor Factory
    ```

2. Install project dependencies:

    ```
    npm install
    ```

3. Start the application:

    ```
    npm run start
    ```

This will start generating dummy sensor data which will be ingested in real-time into our weather server. 

#### API Calls

To retrieve the average in a location within a specific time range, you can make a GET request to the following endpoint:

```
GET http://localhost:8080/weather/average?type=<type>&location=<location>&FROM=<start_date>&TO=<end_date>
```

To retrieve the timeseries data in a location within a specific time range, you can make a GET request to the following endpoint:

```
GET http://localhost:8080/weather/timeseries?type=<type>&location=<location>&FROM=<start_date>&TO=<end_date>
```

Use API Key as Header =>  `Authorization: SocketTech`

Note: For this project, two types (Temperature, Humidity) and two locations (London, Bangalore) have been implemented. The design is flexible, making it easy to add new sensor types and locations.

Feel free to replace type, location, start_date, and end_date with the specific parameters you want to use in your API calls.


Folder Structure
----------------

The project is organized into the following directories:

-   Sensor Factory: This directory is used to simulate dummy sensor data for testing purposes.

    -   `dist`: Compiled JavaScript files.
    -   `package-lock.json`: Dependency lock file.
    -   `package.json`: Dependency configuration.
    -   `src`: Source code for sensor data simulation.
    -   `tsconfig.json`: TypeScript configuration.
-   Weather API: This directory contains the main API for the weather monitoring application.

    -   `.env`: Configuration file for environment variables, including Redis server credentials and DB credentials.
    -   `coverage`: Code coverage reports.
    -   `dist`: Compiled JavaScript files.
    -   `jest.config.ts`: Jest testing configuration.
    -   `package-lock.json`: Dependency lock file.
    -   `package.json`: Dependency configuration.
    -   `src`: Source code for the weather API.
    -   `tests`: Unit tests organized by components.
    -   `tsconfig.json`: TypeScript configuration.

API Project Structure
---------------------

### Structure
```
└─ Weather API
   ├─ src
   │  ├─ app.ts
   │  ├─ config
   │  │  └─ ...
   │  ├─ controller
   │  │  └─ ...
   │  ├─ domain
   │  │  └─ ...
   │  ├─ port
   │  │  ├─ message-broker
   │  │  ├─ reading-handlers
   │  │  │  └─ ...
   │  │  ├─ sensor-data-consumer
   │  │  └─ transformer
   │  │     └─ ...
   │  ├─ repository
   │  │  └─ ...
   │  ├─ routes
   │  │  └─ ...
   │  ├─ service
   │  │  └─ ...
   │  └─ setup.ts
   ├─ tests
   │  └─ unit
   │     └─ ...
```

### API Routes

API routes within the "Weather" use case are organized in the `weather.controller.ts` file. These routes include endpoints for retrieving weather data based on query parameters, such as type, location, from, and to.

Middleware and Services
-----------------------

-   API Key Middleware: Located in `app.ts`, this middleware checks the presence and validity of API keys in the request headers for authentication and authorization purposes.

Database Schema
---------------

The database schema includes two tables:

-   Sensor Table: Stores sensor metadata.

    -   `id`: Unique identifier for each sensor.
    -   `type`: Type of sensor (e.g., temperature, humidity).
    -   `serial_number`: Unique serial number for each sensor.
    -   `location`: Location where the sensor is installed.
    -   `units`: Units of measurement used by the sensor.
-   Weather Table: Stores historical weather readings.

    -   `id`: Unique identifier for each weather reading.
    -   `sensor_id`: Foreign key reference to the associated sensor.
    -   `measured_at`: Timestamp indicating when the weather reading was measured (with a default value of the current timestamp).
    -   `value`: Numeric value of the weather reading (e.g., temperature value).

Message Broker Configuration
----------------------------

The project uses an online Redis server as the message broker for handling real-time data updates. Connection details, including host, port, username, and password, are stored in the `.env` file.

Authentication
--------------

User authentication is implemented using API keys. Users must include a valid API key in the request headers to access protected endpoints. The API Key Middleware in `app.ts` checks and validates API keys.

Testing Structure
-----------------

Unit tests are organized in the `tests` directory, following the same structure as the `src` directory. Tests are categorized by components, such as controllers, port adapters, repositories, services, and routes.


Improvements before Prod Release
---------- 

While the current implementation meets the project's requirements, there are several areas where I would do things differently if this was going into prod:

### 1. Security

   - **OAuth2**: Implement OAuth2 authentication for more secure and flexible user authentication and authorization.

   - **JWT**: Use JWT auth for inter-service calls.

### 2. Monitoring and Logging

   - **Logging**: Implement a robust logging system to capture and analyze application logs for debugging and performance monitoring.

   - **Monitoring**: Set up application monitoring tools and dashboards to gain insights into the system's performance and health.

### 3. Testing

   - **Integration Tests**: Expand test coverage to include integration tests and end-to-end tests to ensure system reliability.

### 4. Deployment and DevOps

   - **Dockerization**: Containerize the application using Docker to simplify deployment and environment consistency.

   - **Continuous Integration/Continuous Deployment (CI/CD)**: Implement CI/CD pipelines for automated testing and deployment.

### 5. Error Handling

   - **Graceful Error Handling**: Improve error handling to provide meaningful error messages to clients and gracefully recover from failures.

### 6. Design

   - **ORM**: Opt for strictly typed ORMs such as TypeORM to enhance database interactions.
   - **Dependency Injection**: Implement Dependency Injection to improve code organization and maintainability. 


* * * * *

With this documentation, you have an overview of the project's structure, components, and configuration. Please review it, and if you have any specific additions or modifications you'd like to make or if you have any further questions, feel free to let me know.
