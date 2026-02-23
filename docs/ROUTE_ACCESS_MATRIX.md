# MedConnect Route Access Matrix

This matrix is a quick-reference for frontend routes and backend API access constraints.

## A) Frontend Routes -> Role/Guard/API Dependencies

| Route | Layout/Shell | Allowed Role(s) | Guard | Primary API Dependencies | Notes |
|---|---|---|---|---|---|
| `/` | `MainLayout` | guest, patient, pharmacy, admin | none | public data via child components | Home/marketing entrypoint |
| `/shop` | `MainLayout` | all | none | `GET /api/public/drugs` | Add-to-cart allowed; checkout later enforces patient |
| `/prescription` | `MainLayout` | all | none | n/a (page-specific) | Public route |
| `/healthservice` | `MainLayout` | all | none | n/a | Public route |
| `/about` | `MainLayout` | all | none | n/a | Public route |
| `/contact` | `MainLayout` | all | none | n/a | Public route |
| `/pharmacies` | `MainLayout` | all | none | `GET /api/public/pharmacies` | Public list/filter |
| `/pharmacy/:id/drugs` | `MainLayout` | all | none | `GET /api/public/pharmacies/:id`, `GET /api/public/pharmacies/:id/drugs` | Public pharmacy detail + catalog |
| `/drug/:drugId/pharmacies` | `MainLayout` | all | none | `GET /api/public/drugs/:drugId/pharmacies` | Cross-pharmacy comparison |
| `/register` | `AuthLayout` | unauthenticated only | redirect if authenticated | `POST /api/auth/register` | UI allows patient/pharmacy only |
| `/login` | `AuthLayout` | unauthenticated only | redirect if authenticated | `POST /api/auth/login` | Redirect by role home |
| `/pharmacy` | `PharmacyLayout` | pharmacy | `RequireRole(role="pharmacy")` | `GET /api/pharmacies/me`, `GET /api/pharmacies/me/orders`, `GET /api/drugs/my` | Dashboard overview |
| `/pharmacy/orders` | `PharmacyLayout` | pharmacy | `RequireRole(role="pharmacy")` | `GET /api/pharmacies/me/orders`, `PATCH /api/orders/:id/status` | Status mutation |
| `/pharmacy/drugs` | `PharmacyLayout` | pharmacy | `RequireRole(role="pharmacy")` | `GET /api/drugs/my`, `POST /api/drugs`, `PUT /api/drugs/:id`, `DELETE /api/drugs/:id` | Drug CRUD |
| `/pharmacy/profile` | `PharmacyLayout` | pharmacy | `RequireRole(role="pharmacy")` | `GET /api/pharmacies/me`, `PATCH /api/pharmacies/me` | Profile updates impact public display |
| `/admin` | `AdminLayout` | admin | `RequireRole(role="admin")` | `GET /api/admin/stats` | KPI dashboard |
| `/admin/users` | `AdminLayout` | admin | `RequireRole(role="admin")` | `GET /api/admin/users` | User listing/filtering |
| `/admin/pharmacies` | `AdminLayout` | admin | `RequireRole(role="admin")` | `GET /api/admin/pharmacies` | Pharmacy listing/filtering |

## B) Backend Endpoints -> Access Control

| Endpoint | Method | Middleware | Effective Access |
|---|---|---|---|
| `/api/auth/register` | POST | none | public |
| `/api/auth/login` | POST | none | public |
| `/api/auth/logout` | POST | none | public/authenticated |
| `/api/auth/me` | GET | `verifyToken` | authenticated user |
| `/api/public/pharmacies` | GET | none | public |
| `/api/public/pharmacies/:id` | GET | none | public |
| `/api/public/pharmacies/:id/drugs` | GET | none | public |
| `/api/public/drugs` | GET | none | public |
| `/api/public/drugs/:id` | GET | none | public |
| `/api/public/drugs/:drugId/pharmacies` | GET | none | public |
| `/api/pharmacies/me` | GET | `verifyToken`, `isPharmacy` | pharmacy only |
| `/api/pharmacies/me` | PATCH | `verifyToken`, `isPharmacy` | pharmacy only |
| `/api/pharmacies/me/orders` | GET | `verifyToken`, `isPharmacy` | pharmacy only |
| `/api/pharmacies/:pharmacyId/orders` | GET | `verifyToken`, `isPharmacy` | pharmacy only (own pharmacy check in controller) |
| `/api/drugs` | POST | `verifyToken`, `isPharmacy` | pharmacy only |
| `/api/drugs/my` | GET | `verifyToken`, `isPharmacy` | pharmacy only |
| `/api/drugs/:id` | PUT | `verifyToken`, `isPharmacy` | pharmacy only (ownership check in controller) |
| `/api/drugs/:id` | DELETE | `verifyToken`, `isPharmacy` | pharmacy only (ownership check in controller) |
| `/api/orders` | POST | `verifyToken`, `isPatient` | patient only |
| `/api/orders/my` | GET | `verifyToken`, `isPatient` | patient only |
| `/api/orders/:id` | GET | `verifyToken` | patient owner, pharmacy owner, or admin (controller check) |
| `/api/orders/:id/status` | PATCH | `verifyToken`, `isPharmacy` | pharmacy only (own pharmacy order check) |
| `/api/admin/stats` | GET | `verifyToken`, `isAdmin` | admin only |
| `/api/admin/users` | GET | `verifyToken`, `isAdmin` | admin only |
| `/api/admin/pharmacies` | GET | `verifyToken`, `isAdmin` | admin only |
| `/api/admin/orders` | GET | `verifyToken`, `isAdmin` | admin only |

## C) Redirect Matrix

| Condition | Result |
|---|---|
| Unauthenticated user enters protected route | Redirect to `/login` |
| Authenticated pharmacy enters `/login` or `/register` | Redirect to `/pharmacy` |
| Authenticated admin enters `/login` or `/register` | Redirect to `/admin` |
| Authenticated patient enters `/login` or `/register` | Redirect to `/` |
| Authenticated wrong role enters protected shell | Redirect to home by `getHomeRouteByRole(role)` |

## D) Access Truth Notes
- Admin role exists in DB model but is not selectable in frontend registration.
- Admin access currently requires seeded/manual admin account creation.
- Checkout is intentionally patient-only and single-pharmacy constrained.
