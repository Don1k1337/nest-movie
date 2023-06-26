## Description

Simple Movie CRUD API, built with the help of [Nest.js](https://github.com/nestjs/nest) framework.
Technologies that was used: 
- Nest.js
- TypeScript
- Prisma
- PostgreSQL
- Docker
## ER Schema

This is the schema that defines the structure of the entities in the database. It consists of two models: User and Movie.

### User Model
- id: Unique identifier for each user (auto-incremented integer).
- createdAt: Date and time when the user was created (automatically set to the current date and time).
- updatedAt: Date and time when the user was last updated (automatically updated).
- email: Unique email address of the user.
- hash: Hashed value of the user's password.
- firstName: Optional first name of the user.
- lastName: Optional last name of the user.
- movies: List of movies associated with the user.

### Movie Model
- id: Unique identifier for each movie (auto-incremented integer).
- title: Title of the movie.
- description: Description of the movie.
- userId: Foreign key referencing the associated user.
- user: Relationship with the User model, indicating the user who created the movie.

![ER Diagram](er-diagram.png)

## Prerequisites

To set up this project locally, make sure you have the following installed:

- Node.js (v18)
- Docker (v24.0.2)

Please make sure you have Node.js and Docker installed before proceeding with the project setup.
## Installation

```bash
$ yarn install
```

## Initial setup

To correctly set up and run the database locally using this Docker Compose file, follow these steps:

1. Create a new file named `.env` in the same directory as the Docker Compose file.
2. Open the `.env` file and add the following environment variables with their respective values:

```dotenv
DATABASE_URL="postgresql://postgres:mypassword@localhost:5434/mydatabase?schema=public"
POSTGRES_USER="myusername"
POSTGRES_PASSWORD="mypassword"
POSTGRES_DB="mydatabase"
JWT_SECRET="mysecret"
```

Replace `myusername`, `mypassword`, `mydatabase`, and `mysecret` with your desired values.

1. Save and close the `.env` file.
2. Open your terminal or command prompt and navigate to the directory containing the Docker Compose file.
3. Run the following command to start the containers:

```shell
docker-compose up -d
```

This command will start in the background the PostgreSQL containers defined in the Docker Compose file.

The database will now be accessible on the following ports:

Development database: `localhost:5434`

Test database: `localhost:5435`

You can now connect to the databases using a Prisma client, PostgreSQL client or use them in your application by configuring the connection details accordingly.

_Note: Make sure you have Docker installed and running on your local machine before running the Docker Compose command._

Feel free to modify the Docker Compose file and environment variables according to your specific requirements.

## Applying Prisma Migrations

After cloning the repository and initial set up the database, follow these steps to apply Prisma migrations:

1. Make sure you have the Prisma CLI installed globally. If not, install it by running the following command:

```bash
$ npm install -g prisma
```

1. Open a terminal or command prompt and navigate to the root directory of the project.

2. Run the following command to generate Prisma client and apply migrations:

```bash
$ npx prisma migrate dev
```

This command will generate the Prisma client and create the necessary database tables and schema changes based on the defined migrations.

_Note: Make sure your database connection details are properly configured in the `.env` file for `DATABASE_URL` or in the Prisma configuration file (`prisma/schema.prisma`)._

Once the migrations are applied, you can start the application.
## Running the app
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Running the tests
Test cases using the mock test environment from the Docker Compose file. To correctly run the test cases, you should follow these instructions:

1. Create a new file named `.env.test` in the same directory as the Docker Compose file.
2. Open the `.env.test` file and add the following environment variables with their respective values:
```dotenv
DATABASE_URL="postgresql://postgres:mypassword@localhost:5435/mydatabase?schema=public"
POSTGRES_USER="myusername"
POSTGRES_PASSWORD="mypassword"
POSTGRES_DB="mydatabase"
JWT_SECRET="mysecret"
```
Replace `myusername`, `mypassword`, `mydatabase`, and `mysecret` with your desired values.

_Note: The port of the testing database is different from the one specified in the `.env` file, so please set up the connection string of `DATABASE_URL` correctly according to the Docker Compose `test-db` environment._

1. Save and close the `.env.test` file.
2. Open your terminal or command prompt.
3. Run the following command to execute the test environment and run the test cases:
```bash
$ yarn test:e2e
```
