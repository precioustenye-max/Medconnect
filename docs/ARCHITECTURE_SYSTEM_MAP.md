# MedConnect Architecture System Map

## 1. System Overview

### Purpose and Operational Domains
MedConnect currently operates as a multi-role healthcare commerce platform with four core domains:
- Public browsing and discovery (drugs, pharmacies, availability)
- Patient commerce flow (cart, checkout, order creation)
- Pharmacy operations dashboard (manage drugs, orders, profile)
- Admin governance dashboard (monitor users, pharmacies, system metrics)

### Runtime Architecture
- Frontend:
  - React (Vite)
  - React Router route tree in `Frontend/src/App.jsx`
  - Zustand auth store in `Frontend/src/store/auth.store.js`
  - Cart context in `Frontend/src/contexts/CartContext.jsx`
- Backend:
  - Express server in `backend/server.js`
  - Sequelize models and associations in `backend/models/*`
  - JWT cookie authentication (`token`) with role middleware in `backend/middleware/auth.middleware.js`

## 2. Frontend Route Map and Page Flow

### Global Route Tree (`Frontend/src/App.jsx`)
- Auth shell (`AuthLayout`):
  - `/register`
  - `/login`
- Main public shell (`MainLayout`):
  - `/`
  - `/shop`
  - `/prescription`
  - `/healthservice`
  - `/about`
  - `/contact`
  - `/pharmacies`
  - `/pharmacy/:id/drugs`
  - `/drug/:drugId/pharmacies`
- Pharmacy shell (`RequireRole role="pharmacy"`):
  - `/pharmacy`
  - `/pharmacy/orders`
  - `/pharmacy/drugs`
  - `/pharmacy/profile`
- Admin shell (`RequireRole role="admin"`):
  - `/admin`
  - `/admin/users`
  - `/admin/pharmacies`

### Layout Boundaries
- `MainLayout` renders `Header` + page `Outlet` + `Footer`.
- `AuthLayout` blocks authenticated users from login/register and redirects by role home route.
- `RequireRole` protects dashboard shells and redirects unauthorized roles to role home.

### User Journey Maps

#### Guest Journey
1. Lands on `/`.
2. Navigates via header to `/shop` or `/pharmacies`.
3. Can browse products and pharmacies.
4. If checkout is attempted without login, redirected to `/login`.

#### Patient Journey
1. Registers as `patient` (or logs in as patient).
2. Redirect target after login: `/` (from `getHomeRouteByRole`).
3. Browses `/shop` or `/drug/:drugId/pharmacies`.
4. Adds items to cart (cart persisted in localStorage).
5. Checkout from cart -> `POST /api/orders` (patient only).

#### Pharmacy Journey
1. Registers as `pharmacy` (registration also creates pharmacy record).
2. Login redirect target: `/pharmacy`.
3. Uses dashboard pages for:
  - Overview metrics
  - Order status updates
  - Drug CRUD
  - Profile updates (delivery/open/license etc.)

#### Admin Journey
1. Admin account must already exist in DB (not self-registered from UI).
2. Login redirect target: `/admin`.
3. Uses dashboard pages for:
  - Global stats and recent orders
  - User listing/filtering
  - Pharmacy listing/filtering

### Transition Triggers
- Header nav (`Frontend/src/Components/Header.jsx`) drives public page routing.
- `navigate(...)` is used in login, register, cart checkout fallbacks, drug/pharmacy detail pages.
- Header shows Dashboard shortcut when authenticated as `admin` or `pharmacy`.

## 3. Role Access and Auth Lifecycle

### Auth Store Lifecycle (`useAuthStore`)
- Store persisted in `localStorage` key: `medconnect-auth`.
- Stored values: safe `user` payload + `sessionExpiresAt`.
- TTL: 24 hours (`SESSION_TTL_MS`).
- `initializeAuth()` logic:
  - If state already ready: no-op.
  - If persisted session still fresh: mark ready.
  - Else fallback call: `GET /api/auth/me`.
  - On failure: clear user and mark ready.

### Guard and Redirect Behavior
- `RequireRole`:
  - Not ready: returns `null`.
  - Unauthenticated: redirects to `/login`.
  - Wrong role: redirects to `getHomeRouteByRole(user.role)`.
- `AuthLayout`:
  - If authenticated, redirects away from auth pages to role home.
- Role home mapping (`Frontend/src/config/roleRoutes.js`):
  - `pharmacy` -> `/pharmacy`
  - `admin` -> `/admin`
  - default (`patient`) -> `/`

### Admin Access Truth
- Register UI only exposes `patient` and `pharmacy` options.
- DB supports `admin` role (`backend/models/user.model.js`).
- Admin users currently require seed/manual DB creation or backend admin provisioning.

## 4. Public Commerce Data Flow

### Page -> API Mapping
- `/shop` -> `GET /api/public/drugs`
- `/pharmacies` -> `GET /api/public/pharmacies`
- `/pharmacy/:id/drugs` ->
  - `GET /api/public/pharmacies/:id`
  - `GET /api/public/pharmacies/:id/drugs`
- `/drug/:drugId/pharmacies` -> `GET /api/public/drugs/:drugId/pharmacies`

### Cart and Checkout Constraints
- Cart context persists `medconnect-cart` in localStorage.
- Checkout guardrails in `CartPage`:
  - Must be authenticated.
  - Must be `patient` role.
  - Cart cannot be empty.
  - All cart items must belong to exactly one pharmacy.
- Order payload shape:
  - `{ pharmacyId, items: [{ drugId, quantity }] }`
- Backend creates order + order items in transaction and decrements stock.

## 5. Pharmacy Dashboard Flow

### Route Map
- `/pharmacy`
- `/pharmacy/orders`
- `/pharmacy/drugs`
- `/pharmacy/profile`

### API Dependencies
- `GET /api/pharmacies/me`
- `PATCH /api/pharmacies/me`
- `GET /api/pharmacies/me/orders`
- `GET /api/drugs/my`
- `POST /api/drugs`
- `PUT /api/drugs/:id`
- `DELETE /api/drugs/:id`
- `PATCH /api/orders/:id/status`

### Operational Behavior
- Drugs page performs inline CRUD against pharmacy-owned inventory only.
- Orders page updates order status for orders owned by authenticated pharmacy.
- Profile page updates operational fields affecting public visibility (delivery, isOpen, serviceType, hours, etc.).

## 6. Admin Dashboard Flow

### Route Map
- `/admin`
- `/admin/users`
- `/admin/pharmacies`

### API Dependencies
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/pharmacies`
- `GET /api/admin/orders` (backend available; currently not fully surfaced as dedicated page)

### Current Capability Boundaries
- Current admin UI is read/monitor oriented.
- No full admin-side mutation suite for users/pharmacies/orders yet.

## 7. Backend API and Model Inventory

### Route Groups
- `/api/auth`
- `/api/public`
- `/api/pharmacies`
- `/api/drugs`
- `/api/orders`
- `/api/admin`

### Middleware Gates
- `verifyToken`
- `isPatient`
- `isPharmacy`
- `isAdmin`

### Core Models and Relationships
- `User` (`patient|pharmacy|admin`, optional `pharmacyId`)
- `Pharmacy`
- `Drug`
- `Order`
- `OrderItem`

Associations (`backend/models/index.js`):
- Pharmacy 1:M Drug
- Pharmacy 1:M User
- Pharmacy 1:M Order
- User 1:M Order
- Order 1:M OrderItem
- Drug 1:M OrderItem

## 8. Known Gaps and Upgrade Risks
1. `Frontend/src/App.jsx` has `<Toaster position="top-right" />` at top-level outside component render scope.
2. `pickSafeUser` omits `email`, while admin topbar tries to read `user.email` and falls back.
3. Root and frontend README content is stale/inaccurate versus current Node/Express + Sequelize implementation.
4. Some pages include legacy/demo logic remnants and encoding artifacts; normalization needed in premium refactor.

## 9. Validation Checklist for This Documentation
- Every route in `Frontend/src/App.jsx` is represented.
- All backend route modules and protected role boundaries are represented.
- Guest/patient/pharmacy/admin journeys are represented with redirects.
- Admin creation limitation is explicitly called out.
- Page-to-API mappings align with `Frontend/src/services/*.api.js` and backend routes.

## 10. Documentation-Phase API/Type Notes
- No runtime API changes are introduced in this documentation phase.
- Suggested contract standardization for premium phase:
  - `UserSession`
  - `PharmacySummary`
  - `OrderSummary`
