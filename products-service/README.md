# Products Service

Express microservice for product CRUD, using Prisma ORM with a PostgreSQL database hosted by Supabase.

## Configuration

Copy `.env.example` to `.env` in this directory and set the connection URLs from the Supabase project's **Connect** panel. `DATABASE_URL` should use the transaction pooler for runtime queries; `DIRECT_URL` should use a direct or session-pooler connection for migrations. The service also reads the workspace root `.env` for compatibility with the other microservices.

Install dependencies and create the database table:

```sh
npm install
npm run prisma:generate
npm run prisma:migrate
npm start
```

The gateway authenticates requests and forwards `x-user-id` and `x-user-role`. Product reads require an authenticated request through the gateway. Create, update, and delete operations require the `admin` role.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/products` | List products |
| GET | `/products/:id` | Get a product |
| POST | `/products` | Create a product |
| PUT | `/products/:id` | Replace a product |
| PATCH | `/products/:id` | Update product fields |
| DELETE | `/products/:id` | Delete a product |

Create and update bodies use `name` (non-empty string, up to 255 characters) and `price` (non-negative number). `PATCH` accepts either or both fields.