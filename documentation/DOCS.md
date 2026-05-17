# MTN Therapy Practice Portal - Full Documentation

## Introduction

The MTN Therapy Practice Portal is a comprehensive, secure web application designed for therapy practices. It manages clients, therapists, scheduling, invoicing, and provides dedicated portals for both clients and responsible persons (guardians).

## Architecture Overview

The application follows a strict architectural layering:
*   **Frontend:** Next.js App Router (React), Tailwind CSS, shadcn/ui.
*   **Backend / Server Actions:** Next.js Server Actions act as the bridge between the UI and the data layer.
*   **Service Layer:** Dedicated TypeScript modules (`src/lib/services/`) handle all business logic and interact with the database.
*   **Database:** Google Cloud Firestore.
*   **Authentication:** Firebase Authentication (Magic Links and Google SSO).

### The Two-Phase Build Model

The development of this portal follows a strict two-phase approach:

1.  **Phase 1: App-Wide Demo:** All UI components, pages, and layouts are built first using hardcoded demo data (`src/lib/demo/data.ts`). This allows for full visual QA and user journey testing without needing a backend.
2.  **Phase 2: App-Wide Wired:** Once Phase 1 is signed off, the demo data is replaced with real service calls, Server Actions, and Firestore integration.

## Usage Guide

### Roles and Portals

The application supports four primary roles, each with a distinct view:

1.  **Admin (`(admin)`):** Has full access to practice settings, all clients, all therapists, billing, and the complete schedule. Uses the `StaffShell`.
2.  **Therapist (`(therapist)`):** Has access to their assigned clients, their own schedule, and practice notes. Uses the `StaffShell`.
3.  **Client (`(portal)`):** Has access to their own upcoming appointments, invoices, agreements, and settings. Uses the `PortalShell`.
4.  **Responsible Person (`(guardian)`):** Has access to linked client information (appointments, invoices). Can switch context between multiple linked clients. Uses the `PortalShell`.

### Security and Safety

Given the sensitive nature of therapy, the application enforces several strict safety measures:

*   **No Passwords:** Authentication relies on secure Magic Links or Google SSO.
*   **PIN Protection:** Clients and Responsible Persons can set a PIN that must be entered after authenticating via email, preventing access if an email account is compromised.
*   **Quick Exit:** The `PortalShell` includes a constantly visible "Quick Exit" Floating Action Button (FAB) that immediately redirects the user away from the site, replacing the browser history.
*   **Clinical Isolation:** The service layer strictly strips "clinical vault" fields (e.g., therapy history, notes) before sending any client data to the portal-facing routes.

## Developer Guide

### Project Setup

1.  Clone the repository.
2.  Run `npm install` (once dependencies are finalized).
3.  Ensure `.env.local` contains the necessary Firebase configuration.

### Running the Application

*   **Development Server:** `npm run dev`
*   **Firebase Emulators:** `npm run emulators` (Ensure emulators are running during Phase 2 development).

### Code Standards (Highlights)

*   **Firestore Boundaries:** Only files in `src/lib/services/` are permitted to import from `firebase-admin/firestore`. Server actions and components must never call the database directly.
*   **Zod Validation:** All incoming data to Server Actions must be validated using Zod schemas (`src/lib/schemas/`) before being passed to a service.
*   **Result Pattern:** All Server Actions must return an `ActionResult<T>` (success or fail), never throwing unhandled errors to the client.
*   **Audit Logging:** Every mutating action (create, update, delete) must call `logAction` from `audit.service.ts`.
*   **File Size Limits:** Components must be kept under 150 lines. Pages under 100 lines.
*   **No Native Dialogs:** Never use `alert()`, `confirm()`, or `prompt()`. Use the `ConfirmDialog` component.

### Testing

End-to-end testing is performed using Playwright. Tests are located in `src/__tests__/e2e/`.

To run tests:
`npx playwright test`

Tests must cover happy paths, auth boundaries, role boundaries, empty states, error states, and validation.

## Adding a New Feature (Workflow)

1.  **Design:** Ensure the feature fits within the existing `DESIGN.md` container model and shell layouts.
2.  **Demo (Phase 1):**
    *   Create the page/component files.
    *   Add placeholder demo data to `src/lib/demo/data.ts`.
    *   Implement the UI.
3.  **QA:** Review the UI locally.
4.  **Wire (Phase 2):**
    *   Define Zod schemas.
    *   Create/update the service file.
    *   Create the Server Action.
    *   Connect the UI to the Server Action.
    *   Write Playwright tests.
