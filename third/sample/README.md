# College Event Management

Full-stack app with a React frontend and an Express/MySQL backend.

## Project Structure

- `./` (this folder): React frontend
- `./backend`: Express API and MySQL connection

## Prerequisites

- Node.js 18+ and npm
- MySQL server running locally or accessible remotely

## Environment Variables

Create `.env` files from the examples:

- Frontend: copy `.env.example` to `.env`
- Backend: copy `backend/.env.example` to `backend/.env`

Backend envs:
- `JWT_SECRET` is required for auth tokens.
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` are used to seed the admin user.

## Frontend (React)

From this folder:

```
npm install
npm start
```

The app runs on `http://localhost:3000`.

## Backend (Express)

From `backend`:

```
npm install
npm start
```

The API runs on `http://localhost:5000`.

### Database setup

```
node setupDatabase.js
node setupRegistrationTables.js
```

### Seed admin user

```
node seedAdmin.js
```

Use the admin credentials from `backend/.env`.

## Production Build

From this folder:

```
npm run build
```

Deploy the `build` folder to any static host.
