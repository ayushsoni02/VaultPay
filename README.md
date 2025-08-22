## VaultPay

Fast, secure, and user-friendly payments. VaultPay enables seamless peer-to-peer transfers with a modern React frontend and a robust Node.js/Express backend powered by MongoDB. Transactions are executed using MongoDB sessions with replica-set backed ACID guarantees to ensure consistency and atomicity.

### ✨ Features
- **Secure authentication**: JWT-based auth, stored as HttpOnly cookies (Authorization header also supported)
- **User management**: Signup, signin, update profile, and self info endpoint
- **Account services**: Check balance and transfer funds
- **ACID transactions**: Money transfers wrapped in MongoDB session transactions
- **Validation**: Strong request validation via Zod
- **Password security**: bcrypt hashing
- **CORS and cookies**: Configured for browser-based SPA

### 🧱 Tech Stack
- **Frontend**: React + Vite, React Router, Tailwind CSS
- **Backend**: Node.js, Express, Mongoose, Zod, bcrypt, jsonwebtoken, cookie-parser, CORS
- **Database**: MongoDB (replica set for transactions)

---

## Monorepo Layout

```
VaultPay/
  backend/            # Express API
  frontend/           # React + Vite SPA
  Dockerfile          # MongoDB replica-set image (for local ACID transactions)
```

---

## Getting Started

### 1) Prerequisites
- Node.js 18+
- npm or pnpm
- Docker (recommended for local MongoDB replica set)

### 2) Environment Variables
Create `backend/.env` with:

```
MONGO_URL=mongodb://localhost:27017/vaultpay?replicaSet=rs
NODE_ENV=development
```

Notes:
- JWT secret is currently read from `backend/config.js` (`JWT_SECRET`). For production, replace this file to read from environment variables and never commit secrets.

### 3) Start MongoDB with a Replica Set (for transactions)

Option A — Build and run the provided image:
```
docker build -t mongo-rs -f Dockerfile .
docker run -d --name vaultpay-mongo -p 27017:27017 mongo-rs
```

Option B — Use the official image and initialize manually:
```
docker run -d --name vaultpay-mongo -p 27017:27017 mongo:4.4.7 --replSet rs
docker exec -it vaultpay-mongo mongosh --eval "rs.initiate()"
```

Verify:
```
docker exec -it vaultpay-mongo mongosh --eval "rs.status()"
```

### 4) Run the Backend API
```
cd backend
npm install
node index.js
```
- API listens on `http://localhost:3000`

### 5) Run the Frontend
```
cd frontend
npm install
npm run dev
```
- App runs at the Vite URL it prints (typically `http://localhost:5173`)
- The frontend targets the API via `frontend/src/config.jsx`:
  - `export const BACKEND_URL = "http://localhost:3000"`

---

## API Reference

Base URL: `http://localhost:3000/api/v1`

### Auth
- POST `/user/signup`
  - body: `{ email, password, firstName, lastName }`
  - sets HttpOnly `token` cookie; also returns `{ token }`

- POST `/user/signin`
  - body: `{ email, password }`
  - sets HttpOnly `token` cookie; also returns `{ token, user }`

- POST `/user/logout`
  - clears cookie

Auth header alternative:
- `Authorization: Bearer <token>` is supported in addition to the cookie.

### Users
- PUT `/user/` (auth)
  - body: any of `{ firstName?, lastName?, password? }`
  - password is re-hashed on update

- GET `/user/bulk?filter=...` (auth)
  - returns other users (excludes current user), filter matches first/last name (case-insensitive)

- GET `/user/me` (auth)
  - returns `{ firstName, lastName, email }` for the current user

### Accounts
- GET `/account/balance` (auth)
  - returns `{ balance }`

- POST `/account/transfer` (auth)
  - body: `{ to: <userId>, amount: <number> }`
  - executes within a MongoDB session transaction, debits sender and credits recipient atomically

Auth middleware resolves the user via JWT and attaches `req.userId`.

---

## Security Notes
- JWT is issued and stored in an HttpOnly cookie; also accepted via Authorization header for flexibility.
- Passwords are hashed using bcrypt.
- Input validation with Zod across critical endpoints.
- CORS and cookies enabled for SPA usage; set `NODE_ENV=production` to enforce `secure` cookies in production.
- Replace hard-coded `JWT_SECRET` in `backend/config.js` with an environment variable for production deployments.

---

## Development Tips
- If transactions fail with "Transaction numbers are only allowed on a replica set member": ensure MongoDB is running as a replica set and your `MONGO_URL` includes `?replicaSet=rs`.
- If cookies are not set in the browser during local dev: ensure the frontend is calling the same-origin or that CORS and credentials are configured appropriately; in fetch/axios, send credentials when needed.

---

## Scripts

### Frontend (`frontend/package.json`)
- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview production build
- `npm run lint` — lint sources

### Backend
- No npm scripts defined. Start with:
```
node index.js
```

---

## Production Considerations
- Serve the frontend via a CDN or static host; point it to the deployed API URL via `frontend/src/config.jsx`.
- Run the backend behind a reverse proxy (e.g., Nginx), enable HTTPS, and set `NODE_ENV=production` for secure cookies.
- Provide `JWT_SECRET` and `MONGO_URL` via environment variables; do not hardcode secrets.
- Use a managed MongoDB replica set or configure your own high-availability cluster.

---

## License
This project is provided as-is by the author. Update licensing as appropriate.


