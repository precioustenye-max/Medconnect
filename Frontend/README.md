# Pharmacy MedConnect — Project Details

This repository contains a modern web application for an online pharmacy platform. The app is split into a React + Vite frontend and a small PHP backend used for authentication endpoints. Users can browse medicines, search and filter products, upload and manage prescriptions, and perform shopping-cart based purchases.

---

## Purpose and Scope

The project aims to provide a complete user-facing pharmacy experience: product discovery, prescription management, and a checkout-ready shopping cart UI. It's suitable as a prototype or base for a full e-commerce pharmacy product when connected to a backend service and database.

## High-level Architecture

- Frontend: React 19 + Vite, styled with Tailwind CSS. Client-side routing with React Router.
- Backend: Minimal PHP endpoints in `backend/api/auth/` (`login.php`, `register.php`) for authentication. No production API for products yet — products are stored as a static JS dataset.

## Core Features (what the app already offers)

- Product catalog and responsive product grid.
- Category filtering and client-side search (by name or category).
- Product details modal with images, price, prescription indicator, and quantity selector.
- Shopping cart: add items, update quantities, remove items, view totals in a right-hand cart sidebar.
- Prescription management pages: upload prescriptions and view user prescriptions.
- Authentication pages (login/register) that post to PHP endpoints.

## Key Files and Components

- `src/main.jsx` — React entry point.
- `src/App.jsx` — Router and top-level routes.
- `src/layouts/MainLayout.jsx` — Provides header and footer for main site pages.
- `src/pages/Shop.jsx` — Full shop page (search, category filter, cart, hero).
- `src/Components/data/products.jsx` — Static product dataset (used by the frontend).
- `src/Components/UI/` — Reusable components (`ProductCard.jsx`, `ProductGrid.jsx`, `CategoryFilter.jsx`, `CartPage.jsx`, `Button.jsx`, `Input.jsx`, etc.).
- `backend/api/auth/login.php`, `backend/api/auth/register.php` — simple authentication endpoints.

## Data Model (frontend static dataset)

Each product object in `products.jsx` includes:
- `id` — numeric identifier
- `name` — product name
- `src` — image URL
- `category` — category string
- `price` — price in FRS
- `PrescriptionRequired` — boolean (note: case/name inconsistency — see below)

Important: some components expect the flag `prescriptionRequired` (camelCase), while the products file uses `PrescriptionRequired`. This mismatch can cause the prescription badge and logic to fail. Recommendation: standardize to `prescriptionRequired` in `products.jsx` and anywhere used.

## State Management & Data Flow

- The global search term is lifted to `App.jsx` and passed into `MainLayout` and pages.
- Cart and product selection state live in the Shop page and some Header-local state; there is currently no persistence across reloads (no `localStorage` or backend cart).
- Products are read from the static `products.jsx`; there is no backend API serving product data yet.

## Styling and UX

- Uses Tailwind CSS utility classes for responsive design and visual consistency.
- Accessible elements: `aria` attributes are present on some interactive components (e.g., category filter and product buttons).
- The Shop page includes a hero section, category filter bar, and product grid with responsive breakpoints.

## How to run locally (frontend)

1. Open a terminal and go to the frontend folder:

```bash
cd Frontend
```

2. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

3. Build for production and preview:

```bash
npm run build
npm run preview
```

## Backend notes

- The `backend/api/auth/` endpoints are minimal PHP scripts intended to be served by a PHP-enabled server. They will likely need database wiring and validation before production use.

## Known Issues & Immediate Recommendations

1. Standardize the `prescriptionRequired` property name across the product dataset and components.
2. Persist the cart using `localStorage` or a backend tied to authenticated users.
3. Replace the static product dataset with a backend API and a database (MySQL/Postgres) for persistence and admin management.
4. Harden the PHP endpoints: add input validation, hashed passwords, prepared statements, and proper session handling.

## Security and Production Considerations

- Always enable HTTPS in production.
- Sanitize and validate all server-side inputs to avoid SQL injection and XSS.
- Use hashed passwords and secure session management for authentication.
- Add CSRF protection for state-changing forms.

## Suggested Next Enhancements (pick one & I can implement)

- Persist cart to `localStorage` and sync UI across pages.
- Fix the `prescriptionRequired` property mismatch.
- Implement a minimal backend products API and fetch products from the frontend.
- Add payment gateway integration and an order flow.

---

If you want, I can now implement one of the suggested enhancements. Tell me which one to start with and I will update the code and run tests where applicable.

---

*You can copy the contents of this file directly into your project README.*
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
