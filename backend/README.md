# MedConnect Backend

Node.js + Express + MySQL backend for MedConnect.

## Stack
- Node.js (CommonJS)
- Express
- Sequelize + MySQL
- JWT auth (`jsonwebtoken`)
- Password hashing (`bcryptjs`)

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create `.env` (or update existing):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=medconnect
DB_PORT=3306
JWT_SECRET=supersecretkey
```

3. Run server:
```bash
npm run dev
```
or
```bash
npm start
```

Server default: `http://localhost:5000`

## Available Routes

### Health
- `GET /`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Drugs
- `POST /api/drugs/` (pharmacy only, auth required)
- `GET /api/drugs/my` (pharmacy only, auth required)
- `GET /api/drugs/search?name=...`
- `GET /api/drugs/:id`
- `PUT /api/drugs/:id` (pharmacy only, auth required)
- `DELETE /api/drugs/:id` (pharmacy only, auth required)

### Orders
- `POST /api/orders` (patient only, auth required)
- `GET /api/orders/my` (patient only, auth required)
- `GET /api/orders/:id` (owner patient/pharmacy/admin, auth required)
- `PATCH /api/orders/:id/status` (pharmacy only, auth required)

### Pharmacies
- `GET /api/pharmacies/me/orders` (pharmacy only, auth required)
- `GET /api/pharmacies/:pharmacyId/orders` (pharmacy only, auth required)

## Notes
- Current model mapping uses `Drugs.base_price` in MySQL and exposes it as `price` in API responses.
- `Pharmacy` includes `phone` in search results.
- Registering a `pharmacy` user auto-creates a pharmacy profile and links it to the user.
