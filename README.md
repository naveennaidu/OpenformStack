# Openformstack

This repository contains a Nuxt 3 application for creating and managing headless forms. The application uses Prisma for ORM and provides a user interface for creating and managing workspaces and forms.

## Requirements
1. Node.js( ***version 18 or higher*** )

2. Yarn package installer

3. Docker

4. Docker compose.exe if the .exe file is not included in the docker setup installation then download it from the docker page

## Setup Process

1. Clone the repository

```bash
git clone https://github.com/your-repo/OpenformStack.git
cd OpenformStack
```
2. Install Dependencies
   
```bash
yarn install
```
3. Create a `.env` file in the root directory of the project by copying the `.env.example` file:

for linux/macOS users
```bash
cp .env.example .env
```
for windows users
```bash
copy .env.example .env
```

4. Create a .env.developer.local file in the root folder of the project
   
For macOS/Linux 
```bash
touch .env.development.local
```
For windows
```bash
type nul > .env.development.local
```
5. Copy the code into the .env.development.local file

```bash
GOOGLE_CLIENT_ID=508816847621-jd5rqskggrh7veqi4pqjtj3nfleqt405.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET={ask admin for secret}
API_ROUTE_SECRET=(ask admin for secret}
AUTH_ORIGIN="http://localhost:3000"
BASE_URL="http://localhost:3000"
```

6. Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```
7. Run the prisma database migrations and generate the Prisma client:

```bash
yarn prisma:migrate:dev
yarn prisma:migrate:generate
```
8. Start the development server:

```bash
yarn dev
```

If you are facing an error in signing up then delete yarn lock file and node_modules file and re-install the yarn packages.

Yarn commands are often used in the context of database migrations. Here's what each of the commands you mentioned typically does:

a) yarn prisma:migrate:dev:

This command is usually used to apply pending database migrations in a development environment.
It runs the migrations that have been generated but not yet applied to the database.


b) yarn prisma:migrate:generate:
This command generates new Prisma migration files based on changes in your Prisma schema.
It compares the current state of your database with the Prisma schema and generates migration files that represent the changes needed to bring the database schema in sync with the Prisma schema.
