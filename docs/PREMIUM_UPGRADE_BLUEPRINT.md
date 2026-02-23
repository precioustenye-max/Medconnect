# MedConnect Premium Upgrade Blueprint

## Objective
Define a phased, low-risk migration from the current codebase to a premium-grade platform while preserving current route compatibility and existing core behavior.

## Target Architecture Principles

### 1. Unified Design System
- Standardize shell/layout patterns across public, pharmacy, and admin experiences.
- Establish reusable component tokens (spacing, colors, typography, status badges, tables, forms).
- Remove duplicated ad-hoc styles and normalize role dashboard UI language.

### 2. Role-Capability Matrix
- Move from route-only role checks to explicit capability checks.
- Define capabilities by domain (orders, drugs, users, pharmacies, analytics).
- Enforce capability checks on both frontend view logic and backend controllers.

### 3. API Contract Standardization
- Standardize pagination and list envelopes (`items`, `meta`).
- Standardize error shape (`message`, `code`, `details`).
- Standardize DTOs across frontend/backend for key entities:
  - `UserSession`
  - `PharmacySummary`
  - `DrugSummary`
  - `OrderSummary`

### 4. Observability and Auditability
- Add request correlation IDs.
- Add structured logs for privileged operations.
- Add audit events for admin/pharmacy write operations.

## Current-State Constraints to Respect
- Preserve route paths already used in app and links.
- Preserve cookie-auth based session behavior initially.
- Preserve current frontend page entrypoints and user journey semantics.

## Phased Rollout Plan

## Phase 1: Documentation and Access Hardening (Foundation)

### Goals
- Freeze architecture map and access matrix as source-of-truth docs.
- Eliminate immediate auth/access inconsistencies.
- Prepare codebase for larger premium changes with minimal user-facing change.

### Implementation Items
- Keep `docs/ARCHITECTURE_SYSTEM_MAP.md` and `docs/ROUTE_ACCESS_MATRIX.md` updated.
- Fix top-level Toaster placement in `App.jsx`.
- Align frontend safe user payload with topbar needs (`email` decision: include in store or remove dependency).
- Normalize README docs to reflect actual Node/Express backend.
- Add basic smoke tests for role redirects and protected route behavior.

### Exit Criteria
- Route and access docs are complete and reviewed.
- Auth guards behave consistently for all roles.
- Known critical documentation drift is resolved.

## Phase 2: Admin/Pharmacy Feature Parity and CRUD Expansion

### Goals
- Upgrade dashboards from monitor-only to actionable operations.
- Introduce robust admin tools for platform governance.

### Implementation Items
- Admin:
  - Add dedicated orders management page (`/admin/orders`) using existing backend API.
  - Add pharmacy moderation actions (verify/unverify, open/close overrides where policy allows).
  - Add user lifecycle actions (activate/deactivate/reset role with safeguards).
- Pharmacy:
  - Improve drugs editor UX (validation, optimistic updates, bulk actions, image handling).
  - Add order timeline states and clearer fulfillment workflows.

### Backend Enhancements
- Add policy-safe mutation endpoints for admin operations with strict middleware/capability checks.
- Add audit trails for all mutation endpoints.

### Exit Criteria
- Admin and pharmacy dashboards support operational workflows, not just read-only monitoring.
- Mutation actions are audited and role-safe.

## Phase 3: UX Modernization, Performance, and Monitoring

### Goals
- Deliver premium UX consistency and runtime performance improvements.
- Add production observability and error telemetry.

### Implementation Items
- Frontend:
  - Route-level code-splitting for heavy dashboards.
  - Query state normalization and shared table/filter primitives.
  - Improve loading/empty/error states across all data pages.
- Backend:
  - Introduce response caching strategy for high-read public endpoints.
  - Harden validation and schema-level guards.
- Ops:
  - Add central error tracking and dashboards.
  - Add SLO-aligned alerts for auth/order/admin critical paths.

### Exit Criteria
- UX is coherent across all shells.
- Build/runtime performance is measurably improved.
- Production telemetry supports proactive incident detection.

## Compatibility Strategy

### Route Compatibility
- Keep existing route paths stable (`/shop`, `/pharmacy/*`, `/admin/*`).
- Add new admin pages under `/admin/*` without breaking existing links.

### API Evolution
- Prefer additive API changes first.
- Introduce versioning only when breaking contract changes are unavoidable.
- Publish migration notes before deprecating old fields/endpoints.

### Data Compatibility
- Maintain model compatibility while introducing new fields with defaults.
- Backfill data through idempotent migrations.

## Testing and Quality Gates

### Mandatory Scenarios
- Auth and role redirect matrix (guest/patient/pharmacy/admin).
- Checkout constraints:
  - patient-only
  - single-pharmacy cart enforcement
- Pharmacy ownership checks for drug/order mutations.
- Admin-only endpoint access checks.

### Regression Targets
- All routes in `App.jsx` reachable and protected as expected.
- Public discovery flows (`shop`, `pharmacies`, drug-pharmacy cross links) remain intact.
- Existing API consumers continue working with additive backend changes.

## Risks and Mitigation
- Risk: contract drift between frontend and backend.
  - Mitigation: DTO contracts + endpoint contract tests.
- Risk: premium refactor introduces role leakage.
  - Mitigation: capability matrix and middleware integration tests.
- Risk: UI modernization breaks workflow familiarity.
  - Mitigation: phased rollout and route continuity.

## Non-Goals for This Blueprint Stage
- Immediate full rewrite of architecture.
- Replacing auth mechanism in the same phase as dashboard expansion.
- Breaking route changes.

## Deliverable Interfaces Added by This Work
- Architecture System Map (current-state truth)
- Route Access Matrix (quick guard/dependency reference)
- Premium Upgrade Blueprint (decision-complete phased roadmap)
