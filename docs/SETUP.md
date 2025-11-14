# Hospital Management System - Setup Guide

This document explains how to set up and run the Hospital Management System locally.

Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MySQL server (8.x recommended)

1. Clone the repository and open the workspace

2. Database
- Create a database and run the SQL schema located at `server/db/schema.sql`.
  You can run it using the MySQL CLI:

```powershell
mysql -u root -p < server/db/schema.sql
```

- (Optional) Set the admin seed environment variables and run the seed script:

```powershell
# create a .env file in server/ from .env.example and edit values
node server/scripts/seed-admin.js
```

3. Install dependencies

```powershell
cd server; npm install
cd ../client; npm install
```

4. Create a `.env` file in `server/` using `.env.example` and set credentials.

5. Run the server and client

```powershell
# start server
cd server; npm run dev

# in a separate terminal
cd client; npm run dev
```

6. Login
- Open http://localhost:5173 and login with seeded admin credentials (see `.env` or seed output).

Notes
- API base path: `/api/v1`
- If you see CORS errors, ensure server is running and `client/vite` proxy is configured.
- To persist data between runs, use a local MySQL server (not an in-memory DB).

Troubleshooting
- If migrations fail due to foreign key constraints, try running individual table creation queries in order: `departments`, `patients`, `doctors`, `appointments`, `billing`, `admins`.
