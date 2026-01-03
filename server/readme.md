# URL Shortener - Express + Prisma + PostgreSQL
A URL shortener application built with Express.js, Prisma ORM, and PostgreSQL

## Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v18 or higher)
PostgreSQL (v12 or higher)
npm or yarn package manager

## Installation
1. Clone the repository

```bash
git clone <your-repo-url>
cd server
```

2. Install dependencies
```bash
npm install
```
3. Set up PostgreSQL database
Make sure PostgreSQL is running on your machine. You can check by running:

```bash
psql --version
```

4. Configure environment variables
Create a .env file in the root directory:

```bash
touch .env
```

Add the following content to .env:

```bash
DATABASE_URL="postgresql://your_db_name:your_db_pass@localhost:5432/mydb?schema=public"
PORT=3000
```

Replace the values with your PostgreSQL credentials:

- postgres - your PostgreSQL username
- 1234 - your PostgreSQL password
- localhost:5432 - your PostgreSQL host and port
- mydb - your database name

5. Set up Prisma
Create the Prisma configuration file prisma/prisma.config.js:

```bash
mkdir -p prisma
```

The prisma/prisma.config.js file should contain:

```bash
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

6. Generate Prisma Client
```bash
npx prisma generate
```
7. Run database migrations
```bash
npx prisma migrate dev --name init
```

This will create the necessary tables in your PostgreSQL database.


### Project Structure

```bash
server/
├── prisma/
│   ├── schema.prisma          # Prisma schema file
│   ├── prisma.config.js       # Prisma configuration
│   └── migrations/            # Database migrations
├── src/
│   ├── config/
│   │   └── database.js        # Prisma client configuration
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
├── .env                       # Environment variables
├── package.json
└── README.md
```

## Running the Application

### Development mode (with auto-reload)
```bash
npm run dev
```
- The server will start on http://localhost:3000
