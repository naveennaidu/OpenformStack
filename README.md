# OpenformStack

This repository contains a Nuxt 3 application for creating and managing headless forms. The application uses Prisma for ORM and provides a user interface for creating and managing workspaces and forms.
## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (version 18 or higher)
- Yarn package manager
- Docker
- Docker Compose

## Setup

1. Clone the repository:

```bash
git clone https://github.com/naveennaidu/OpenformStack.git
cd OpenformStack
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the root directory of the project by copying the `.env.example` file:

```bash
cp .env.example .env for mac os and linux
use copy instead of cp in windows
```

4. Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

5. Run the prisma database migrations and generate the Prisma client:

```bash
yarn prisma:migrate:dev
yarn prisma:migrate:generate
```

6. Start the development server:

```bash
yarn dev
```

Now, you can access the application at http://localhost:3000.
