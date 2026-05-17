# MTN Therapy Practice Portal
## Build Plan
### Version 5.0 | 17 May 2026
### More Than Normal

---

## Purpose

This document defines what to build, in what order, and how to verify it is complete. It is the implementation instruction set for the MTN Therapy Practice Portal.

---

## Build Model

Each module follows the two-stage lifecycle defined in Engineering Standards Section 16.

**Stage 1: Demo.** Build all UI with hardcoded demo data. No service calls. Every screen viewable in the browser with the dev toolbar role switcher. Visual review and sign-off before proceeding.

**Stage 2: Wired.** Replace demo data with real services, actions, and hooks. Write Playwright tests. Run verification. Produce module completion report.

The developer decides how to split work within each stage. The only gates that matter are: demo sign-off, and module completion sign-off.

Modules are built in the order listed. Each module must be signed off before the next begins.

---

## Critical Efficiency Rules

These rules exist because this build runs on a credit-based system. Wasted compute is wasted money. Follow these without exception.

**Rule 1. Stop and ask rather than loop.**
If you encounter a problem you cannot resolve within two attempts, stop immediately. Do not try a third approach. Write a clear, specific description of what you tried, what failed, and what decision or information you need. Wait for a response before continuing.

**Rule 2. Stop and ask rather than guess.**
If a requirement is ambiguous and your interpretation could go in two meaningfully different directions, stop. Describe the ambiguity and the two options clearly. Wait for a decision before writing any code.

**Rule 3. Never regenerate working code.**
If a file is correct and passing verification, do not touch it unless a later module explicitly requires a change. Do not refactor for style. Do not reorganise for preference.

**Rule 4. No speculative work.**
Do not build features, components, utilities, or test cases not listed in the current module. If you believe something is missing, note it in your module completion report and continue with what is specified.

**Rule 5. Automated tests are not optional.**
Every module requires Playwright tests written during the wired stage. Tests that fail block sign-off.

**Rule 6. Report clearly at module completion.**
At the end of every module, produce a structured completion report in the format defined in Engineering Standards Section 16.

---

## The Design Handoff Rule

If a module requires a UI element not in the component library, stop immediately. Do not improvise a one-off solution. List the missing components in the module completion report under "Blockers requiring human input." Wait for instruction before continuing.

---

## Automated Testing Standards

### Playwright configuration
- Tests live in `src/__tests__/e2e/` organised by module.
- Each module has its own test file: `[module].spec.ts`.
- Tests run against the local development server.
- Firebase Auth is mocked using Firebase Auth Emulator.
- Firestore is mocked using Firestore Emulator.
- Test users are seeded before each test suite and cleaned up after.

### What each module test must cover
- Happy path: the primary user journey works end to end.
- Auth boundary: unauthenticated access to protected routes is blocked.
- Role boundary: a user with the wrong role cannot access the feature.
- Empty state: the feature renders correctly when no data exists.
- Error state: a service failure produces a visible, actionable error message.
- Validation: invalid form input produces correct field-level error messages.

### What module tests do not need to cover
- Visual regression.
- Pixel-perfect layout.
- Performance benchmarks.
- Browser compatibility beyond Chromium.

---

## Before You Begin

Confirm all of the following before writing any code:

- [ ] Firebase project created and configured with Authentication and Firestore.
- [ ] Firebase Auth Emulator and Firestore Emulator configured for testing.
- [ ] Firebase Admin SDK service account key in environment variables.
- [ ] Playwright installed and configured.
- [ ] All planning documents read in full: Blueprint v4, DESIGN v4, Engineering Standards v5, this Build Plan.
- [ ] You understand the stop-and-ask rules above.

---

## FOUNDATION MODULES

Must be complete before any feature work begins.

---

### Foundation Module F1: Project Scaffold and Design System

**What this delivers.** A running Next.js project with the complete design system, all dependencies, tooling, utilities, type definitions, and Firebase emulator configuration. No UI yet. Just the foundation everything else builds on.

**Tasks.**
1. Confirm Next.js App Router, TypeScript strict, `src/` directory, ESLint, Tailwind CSS.
2. Install packages: `firebase`, `firebase-admin`, `zod`, `date-fns`, `lucide-react`, `clsx`, `tailwind-merge`, `bcryptjs`, `@playwright/test`.
3. Install shadcn/ui with Custom preset. Components: Button, Card, Input, Textarea, Label, Badge, Separator, Sheet, Dialog, AlertDialog, Switch, Select, Tabs, Table, Avatar, Checkbox, RadioGroup, Tooltip, Popover, DropdownMenu, Skeleton, ScrollArea, Form.
4. Replace `src/app/globals.css` with the complete token implementation from DESIGN v4. Both light and dark mode. All semantic tokens as CSS custom properties.
5. Replace `tailwind.config.ts` with the complete token mapping from DESIGN v4.
6. Configure Inter font via `next/font/google` in `src/app/layout.tsx`. Apply `inter.variable` to the html element.
7. Create `src/config/tenant.config.ts` with placeholder values clearly marked.
8. Create `src/config/brand.config.json` with placeholder brand values.
9. Create `src/lib/utils.ts`: `cn`, `ok`, `fail`, `formatDate`, `formatTime`, `formatDateShort`, `formatCurrency` (pence to GBP string), `truncate`, `generateClientRef`, `calculateVatAmount`.
10. Create `src/lib/constants.ts`: all route paths as typed const, timing constants, default policy values, notification type constants.
11. Create `src/lib/types.ts` from `MTN_Portal_Type_Definitions_v4.ts`. Copy verbatim. Do not modify.
12. Configure Firebase Auth Emulator and Firestore Emulator in `firebase.json` and `.firebaserc`.
13. Configure Playwright in `playwright.config.ts`. Point to local dev server. Use Chromium only.

**Acceptance criteria.**
- [ ] `npm run dev` starts without errors.
- [ ] `npm run lint` passes with zero errors.
- [ ] TypeScript strict passes with zero errors.
- [ ] `formatCurrency(7500)` returns `'£75.00'`.
- [ ] `calculateVatAmount(9000, 0.20)` returns `1500`.
- [ ] `generateClientRef('CHR', 42)` returns `'CHR-0042'`.
- [ ] globals.css contains both light and dark mode semantic token definitions.
- [ ] Inter font loading correctly in browser.
- [ ] Playwright runs with `npx playwright test` without configuration errors.
- [ ] Firebase emulators start with `firebase emulators:start`.

---

### Foundation Module F2: Firebase Integration and Middleware

**What this delivers.** Firebase client and admin SDK configuration, authentication helpers, route protection middleware, and core service infrastructure.

**Tasks.**
1. Create `src/lib/firebase/config.ts`: initialise Firebase client app from environment variables. Export as singleton.
2. Create `src/lib/firebase/admin.ts`: initialise Firebase Admin SDK. Throw descriptive error if imported in browser context. Export `getAdminApp()` and `getAdminDb()`.
3. Create `src/lib/firebase/auth.ts`: client-side auth helpers. `signInWithMagicLink(email)`, `signInWithGoogle()`, `signOut()`, `onAuthStateChanged(callback)`.
4. Create `src/middleware.ts`: protect all `(admin)`, `(therapist)`, `(portal)`, `(guardian)` route groups. Logic as per Engineering Standards Section 4.1.
5. Create `src/lib/hooks/useAuth.ts`: client-side auth state. Exposes `user`, `isLoading`, `error`.
6. Create `src/lib/hooks/useRole.ts`: exposes `currentRole`, `activeRoles`, `switchRole(role)`.
7. Create `src/lib/services/audit.service.ts`: `logAction(params)` only. Append-only. No delete or update methods.
8. Create `src/lib/services/user.service.ts`: `getUser`, `createUser`, `updateUser`, `setRoleStatus`, `setOnboardingComplete`, `setLastRole`, `setPinLocked`, `resetPinAttempts`, `incrementPinAttempts`.
9. Create `src/lib/services/notification.service.ts`: `createNotification(data)`.

**Acceptance criteria.**
- [ ] `admin.ts` throws a descriptive error when imported in a browser context.
- [ ] Middleware redirects unauthenticated requests from `/admin` to `/login`.
- [ ] Middleware redirects inactive role to role selection when other active roles exist.
- [ ] `user.service.ts` imports Admin SDK only. Not client SDK.
- [ ] `audit.service.ts` has no delete or update methods.
- [ ] TypeScript strict passes with zero errors.

**Playwright tests: `auth-middleware.spec.ts`**
- Unauthenticated request to `/admin` redirects to `/login`.
- Unauthenticated request to `/portal` redirects to `/login`.
- Authenticated admin request to `/admin` proceeds.
- Authenticated client request to `/admin` is blocked.

---

### Foundation Module F3: Core Component Library

**What this delivers.** Every shared component, every layout shell, every form and display primitive. All built with demo data, verified visually, before any feature module begins. This is the largest foundation module.

**Demo stage tasks.**

Build every component from DESIGN v4 component contracts. All consume semantic tokens only. No hardcoded values. No component exceeds 150 lines.

**Layout shells:**
- `StaffShell.tsx` — sticky topbar, slide-in NavDrawer, RoleSwitcher for multi-role staff, NotificationBell, avatar dropdown.
- `PortalShell.tsx` — same as StaffShell plus QuickExitFab always rendered. RoleSwitcher for client/RP. ContextSwitcher for RP with multiple linked clients. Content max-width: portal-content-max-width.
- `PublicShell.tsx` — blank canvas. `canvas-bg`. `min-height: 100vh`. No header, no footer, no chrome.
- `AuthShell.tsx` — centred card. `form-max-width`. `canvas-bg`.
- `NavDrawer.tsx` — shadcn Sheet from left. `drawer-width`. Closes on item click, overlay click, Escape.
- `RoleSwitcher.tsx` — compact dropdown. Active roles only. Calls `switchRole`.
- `ContextSwitcher.tsx` — compact dropdown. RP view only. Linked clients list.
- `QuickExitFab.tsx` — fixed bottom-right. `fab-size`. Pill radius. `z-index: fab`. `window.location.replace`. `aria-label`: "Quick exit — leaves this page immediately". Keyboard accessible.

**Shared components:**
- `PageHeader.tsx` — title, optional description, optional right-aligned actions slot.
- `EmptyState.tsx` — icon, title, description, optional action.
- `StatusBadge.tsx` — maps all status strings from types.ts. `pointer-events: none`. Text always present alongside colour.
- `ConfirmDialog.tsx` — wraps shadcn AlertDialog. Props: `open`, `onConfirm`, `onCancel`, `title`, `description`, `confirmLabel`, `variant`.
- `FormError.tsx` — props: `message`, `id` for `aria-describedby`.
- `LoadingSpinner.tsx` — props: `size`, `label`.
- `DataCard.tsx` — metric card. Title, value, optional description.
- `NotificationBell.tsx` — bell icon with unread count badge.
- `CrisisBox.tsx` — static crisis info. No props. Never imported by any shell.
- `InlineAlert.tsx` — success, warning, error, info variants.
- `OnboardingStageIndicator.tsx` — ten stages. Complete, current, pending. All ten always shown.

**Auth components:**
- `PinEntry.tsx` — numeric input. Attempt counter. Lock message.
- `PinSetup.tsx` — set or change PIN. Confirm field.
- `PinPrompt.tsx` — shown if no PIN set and `pinPromptDismissed` is false. "Do not show again" toggle.

**Form components:**
`FormField`, `TextInput`, `TextareaInput`, `SelectInput`, `RadioGroup`, `CheckboxInput`, `ToggleSwitch`, `DateInput`, `TimeInput`, `SearchInput`, `SubmitButton`.

**Display components:**
`DataTable`, `DetailCard`, `SectionCard`, `TabNav`, `SkeletonBlock`, `SkeletonTable`, `PriceDisplay`, `DateTimeDisplay`.

**Dev toolbar:**
Fixed 40px bar at bottom in development. Role indicator. Theme toggle. Link to Firebase Emulator UI.

**Demo data for F3:** Create `src/lib/demo/data.ts` with demo constants for every component that needs data: sample navigation items, sample notifications, sample status values, sample table rows. This file grows as feature modules add their own demo data.

**Demo stage acceptance criteria.**
- [ ] All shells render without errors.
- [ ] `QuickExitFab` uses `window.location.replace` not `window.location.href`.
- [ ] `QuickExitFab` has correct `aria-label` and is keyboard reachable.
- [ ] `PortalShell` always renders `QuickExitFab`.
- [ ] `PublicShell` renders children with zero additional chrome.
- [ ] `RoleSwitcher` shows only roles where `status === 'active'`.
- [ ] `CrisisBox` not imported by any shell component.
- [ ] `StatusBadge` has `pointer-events: none`.
- [ ] `ConfirmDialog` destructive variant uses danger button styles.
- [ ] `PinEntry` increments attempt count correctly. Shows lock message at attempt 3.
- [ ] `DataTable` renders skeleton when `isLoading`. Renders EmptyState when data is empty.
- [ ] No component file exceeds 150 lines.
- [ ] No hardcoded colour, spacing, or radius values.
- [ ] All interactive elements have correct aria labels.
- [ ] TypeScript strict passes with zero errors.

**Wired stage:** Components in F3 are presentation-only. Wiring happens when they are used in feature modules. F3 wired stage is limited to:

**Playwright tests: `component-smoke.spec.ts`**
- `ConfirmDialog` renders and responds to confirm and cancel.
- `PinEntry` blocks progression after three failed attempts.
- `QuickExitFab` is visible and keyboard-focusable in portal shell.
- `DataTable` renders skeleton rows when loading prop is true.

---

## FEATURE MODULES

Built in strict sequence. Each module signed off before the next begins.

---

### Module 1: Authentication and Practice Setup

**What this delivers.** Login page, magic link flow, Google SSO, practice setup wizard, and the global error and not-found pages. After this module, a user can authenticate and an initial practice can be configured.

**Demo stage delivers:**
- Login page using `AuthShell`. Email input. Magic link button. Google SSO button. No sign-up link. No password field.
- Activate page showing success, expired, and invalid states.
- Practice setup wizard: Step 1 (email + name), Step 2 (practice name + timezone, skippable), Step 3 (contact details, skippable). Progress indicator.
- Global `not-found.tsx` and `error.tsx` with calm messaging.

**Wired stage delivers:**
- `src/lib/schemas/auth.schemas.ts`: `magicLinkSchema`.
- `src/lib/actions/auth.actions.ts`: `sendMagicLinkAction`. Validates. Calls Admin SDK. Returns `ActionResult<void>`. Generic error for unregistered emails.
- `src/app/(auth)/activate/page.tsx`: verifies magic link, sets session cookie, redirects.
- Google SSO handler: verify email is registered, reject if not.
- `src/lib/services/practice.service.ts`: `getPractice`, `createPractice`, `updatePractice`.
- `src/lib/schemas/setup.schemas.ts`: step schemas.
- `src/lib/actions/setup.actions.ts`: `createFirstAdminAction`, `completePracticeSetupAction`.
- Practice setup middleware: returns `notFound()` after completion.

**Acceptance criteria.**
- [ ] Login page has no sign-up link, no password field, no register button.
- [ ] Unregistered email shows generic error. Does not confirm email existence.
- [ ] Valid magic link activates session and redirects correctly.
- [ ] Expired magic link shows calm error with instruction to contact practice.
- [ ] Google SSO rejects unregistered Google accounts.
- [ ] `/setup` returns 404 after `practiceSetupComplete` is true.
- [ ] `/setup` returns 404 if any admin user already exists.
- [ ] Step 1 creates Firebase Auth account and Firestore user.
- [ ] Steps 2 and 3 are skippable.

**Playwright tests: `auth-login.spec.ts`, `setup.spec.ts`**
- Unregistered email submission shows error without revealing email status.
- Registered user magic link flow completes and redirects.
- Google SSO with unregistered account is rejected.
- Login page has no sign-up or register element in the DOM.
- `/setup` returns 404 when `practiceSetupComplete` is true.
- Step 1 completion creates user record in Firestore emulator.
- Skipping steps 2 and 3 completes the wizard.
- Revisiting `/setup` after completion returns 404.

---

### Module 2: Admin Settings and Practice Configuration

**What this delivers.** Admin onboarding flow, practice settings page, appointment types, and rooms. After this module, a practice is fully configured and ready for therapist and client management.

**Demo stage delivers:**
- Admin onboarding flow: practice details, branding, policy defaults. Skippable steps.
- Settings page with tabs: Practice Details, Policies, Appointment Types, Rooms, Branding.
- Appointment types list with create, edit, archive. Two default types shown: "Initial Assessment" and "Individual Therapy Session".
- Rooms list with create, edit, deactivate.

**Wired stage delivers:**
- `src/lib/actions/settings.actions.ts`.
- `src/lib/services/appointmentType.service.ts`: CRUD plus auto-seed of two defaults.
- `src/lib/schemas/appointmentType.schemas.ts`.
- `src/lib/actions/appointmentType.actions.ts`.
- `src/lib/services/room.service.ts`: CRUD.
- Admin onboarding sets `onboarding.admin: true` on completion.

**Acceptance criteria.**
- [ ] Admin onboarding skippable steps work correctly.
- [ ] `onboarding.admin: true` set on completion.
- [ ] Two default appointment types created when collection is empty.
- [ ] Fee stored as integer pence.
- [ ] Room deactivation removes from active list.

**Playwright tests: `admin-settings.spec.ts`**
- Admin onboarding flow completes. Flag set.
- Default appointment types exist on first load.
- Admin can create a new appointment type.
- Archived type not in active list.
- Admin can create a room. Deactivated room not in active list.

---

### Module 3: Therapist Management

**What this delivers.** Therapist invitation, onboarding, profile management, and leave management. After this module, a practice can invite therapists, who can log in, set up their profiles, and manage leave.

**Demo stage delivers:**
- Therapist list page at `/admin/therapists`.
- Therapist detail/profile page at `/admin/therapists/[id]`.
- Therapist invite form (admin view).
- Therapist onboarding flow: working hours setup (required), biography and specialisms (optional).
- Therapist profile management: biography, qualifications, specialisms, working hours editor.
- Archive flow with `ConfirmDialog` surfacing active clients.
- Leave submission form (therapist view).
- Leave approval/rejection view (admin view).

**Wired stage delivers:**
- `src/lib/services/therapist.service.ts`: CRUD plus archive.
- `src/lib/schemas/therapist.schemas.ts`.
- `src/lib/actions/therapist.actions.ts`: `inviteTherapistAction`. Creates Firebase Auth account via Admin SDK. Creates user and therapistProfiles documents. Sends magic link. Resend after 72 hours.
- `src/lib/services/leave.service.ts`: CRUD plus approval workflow.
- Therapist onboarding sets `onboarding.therapist: true`.

**Acceptance criteria.**
- [ ] Invite creates Firebase Auth account and Firestore records with correct role/status.
- [ ] Therapist onboarding requires working hours. Optional steps skippable.
- [ ] Therapist cannot access another therapist's profile.
- [ ] Leave approval blocks availability (enforced in Module 6).
- [ ] Archive confirmation shows active clients.

**Playwright tests: `therapist-management.spec.ts`**
- Admin invite creates correct Firestore records.
- Therapist onboarding sets flag on completion.
- Therapist can update own working hours.
- Therapist cannot access another therapist's profile.
- Admin can approve and reject leave.
- Therapist can submit leave request.

---

### Module 4: Client Management and CRM

**What this delivers.** Client records, responsible persons, billing contacts, consent records, practice notes, and client archive flow. After this module, a practice can manage its full client base.

**Demo stage delivers:**
- Client list at `/admin/clients`.
- Client detail view at `/admin/clients/[id]` with tabbed sections: Overview, Clinical (admin only), Contacts, Notes, Billing, History.
- Add client form. Client ref auto-generated.
- Responsible person form on client record (with/without portal access).
- Billing contact form on client record.
- Consent recording form and history display.
- Practice note creation (admin and therapist views). Urgent priority indicator. Acknowledgement flow. Archive flow.
- Client archive flow with `ConfirmDialog` showing consequences (future appointments, unpaid invoices, credit balance).

**Wired stage delivers:**
- `src/lib/services/client.service.ts`: full CRUD. `getClientForPortal` strips clinical vault fields. Client ref auto-generation with counter document.
- `src/lib/services/responsiblePerson.service.ts`.
- `src/lib/services/billingContact.service.ts`.
- `src/lib/services/consent.service.ts`: append-only.
- `src/lib/services/practiceNote.service.ts`: never returned by portal-facing functions.
- `src/lib/schemas/client.schemas.ts`.
- `src/lib/actions/client.actions.ts`: including `archiveClientAction`.

**Acceptance criteria.**
- [ ] `getClientForPortal` never returns `previousTherapyHistory`, `presentingIssues`, `currentMedication`, or `safeguarding`.
- [ ] Client ref generated correctly (`{prefix}-{sequence}` padded to 4 digits).
- [ ] RP with portal access creates Firebase Auth account.
- [ ] Consent records cannot be deleted via service layer.
- [ ] Practice notes not accessible via client portal routes.
- [ ] Archived client has correct fields set: `status`, `retentionExpiresAt`, `archivedBy`, `archiveReason`.
- [ ] Audit log contains archive entry.

**Playwright tests: `client-management.spec.ts`**
- Admin can create client with correct ref.
- `getClientForPortal` response contains no clinical vault fields (mandatory test per Engineering Standards 7.6).
- Non-admin cannot access client list.
- Admin can add RP with and without portal access.
- Consent appears in history with timestamp. Cannot be deleted.
- Urgent practice note shows priority indicator.
- Therapist can create note on own client only.
- Archive confirmation shows consequences. Archived client has correct Firestore state.

---

### Module 5: Onboarding Pipeline

**What this delivers.** The full 10-stage client onboarding lifecycle: pipeline view, extended form, therapy agreement, portal invitation, and client first-login safety wizard. After this module, a client can be taken from enquiry through to active portal access.

**Demo stage delivers:**
- Onboarding pipeline view at `/admin/onboarding`. All clients in progress. Stage filter. `OnboardingStageIndicator` per client. Quick action buttons per stage.
- Extended onboarding form at `/onboard/[token]` using `PublicShell`. Multi-step form. `CrisisBox` on every step. Session storage for progress. Expired/used token error states.
- Agreement signing page at `/sign/[token]` using `PublicShell`. Scroll-to-sign: accept checkbox hidden until scrolled to bottom. Accept button disabled until checkbox ticked.
- Client first-login safety wizard: Welcome, Clinical Privacy, Quick Exit explanation, Private Browsing Advisory (non-skippable), PIN Setup (skippable). Resume from last step after browser close.
- `PinPrompt` shown if no PIN set and `pinPromptDismissed: false`.

**Wired stage delivers:**
- `src/lib/services/token.service.ts`: `generateToken` (stores SHA-256 hash, returns raw token), `validateAndConsumeToken` (sets `used: true` on first access).
- `src/lib/services/agreement.service.ts`: template CRUD, `sendAgreement`, `acceptAgreement`.
- `src/lib/schemas/agreement.schemas.ts`.
- `src/lib/actions/agreement.actions.ts`.
- `src/lib/actions/onboarding.actions.ts`.
- Agreement template editor in `/admin/agreements`.
- Portal invitation flow: creates Firebase Auth account, sends magic link, updates stage.

**Acceptance criteria.**
- [ ] Pipeline shows clients grouped by stage. Filter works.
- [ ] `generateToken` stores hash only. Raw token never in Firestore.
- [ ] `validateAndConsumeToken` sets `used: true` on first access regardless of outcome.
- [ ] `CrisisBox` renders on every step of the public extended form.
- [ ] Expired token returns calm error, not a crash.
- [ ] Agreement cannot be sent before `assessment_complete` stage.
- [ ] Accept checkbox only visible after scrolling to bottom.
- [ ] Content hash matches between render and storage.
- [ ] Portal invitation cannot be sent before `agreement_accepted`.
- [ ] Client onboarding Step 4 cannot be skipped.
- [ ] Step 5 (PIN) has "Set up later" option.
- [ ] Wizard resumes from last step after browser close.
- [ ] `onboarding.client: true` set on completion.

**Playwright tests: `onboarding-pipeline.spec.ts`**
- Pipeline stages display correctly. Filter works.
- Valid token renders extended form. Expired token shows error.
- Form submission updates client stage.
- `CrisisBox` present in DOM on every form step.
- Agreement accept checkbox hidden until scroll.
- Signed agreement creates record with correct hash.
- Used token returns error on second access.
- Admin cannot send agreement before `assessment_complete`.
- Admin cannot send portal invite before `agreement_accepted`.
- Client onboarding Step 4 skip button not present. Step 5 skippable.
- Wizard resumes after session restart.
- Completing wizard sets `onboarding.client: true`.

---

### Module 6: Scheduling

**What this delivers.** Availability service, manual booking, recurring schedule engine, attendance marking, and calendar views. After this module, a practice can manage its full appointment schedule.

**Demo stage delivers:**
- Admin schedule view at `/admin/schedule`: calendar view with filter by therapist, room, date range. Day, week, and list views.
- Manual booking form: client, therapist, appointment type, date, time, modality, room. Availability check feedback. Bank holiday warning.
- Recurring schedule setup on client record: frequency, day, start time, appointment type, therapist, room.
- Attendance marking UI (admin and therapist views). Status transitions.
- Therapist schedule view showing own appointments only.

**Wired stage delivers:**
- `src/lib/services/availability.service.ts`: `getAvailableSlots(options)`. Reads working hours, appointments, leave, blocks, bank holidays. Buffer calculation. Conflict check uses `slotEndTime`. Throws if range exceeds `publicBookingWindowDays`.
- `src/lib/services/bankHoliday.service.ts`.
- `src/lib/services/appointment.service.ts`: full CRUD. All write functions set `isManuallyModified: true`.
- `src/lib/services/scheduling.service.ts`: `runSchedulingEngine(practiceId)`. Five absolute rules from Blueprint Section 12. Idempotent. Partial failures do not abort. Generates 8 weeks ahead.
- `src/lib/schemas/appointment.schemas.ts`.
- `src/lib/actions/appointment.actions.ts`.
- `src/lib/actions/booking.actions.ts`.

**Acceptance criteria.**
- [ ] Conflict check uses `slotEndTime` not `endTime`.
- [ ] Buffer: `appointmentType.bufferMinutes ?? practice.bufferMinutes`.
- [ ] Throws when date range exceeds `publicBookingWindowDays`.
- [ ] Leave records exclude affected dates from availability.
- [ ] All manual write functions set `isManuallyModified: true`.
- [ ] Conflicting slot returns conflict error.
- [ ] Bank holiday date shows warning (not a block).
- [ ] `isManuallyModified: true` appointments never touched by engine.
- [ ] Running engine twice produces same appointments (idempotent).
- [ ] Pausing does not change `activeFrom`.
- [ ] Bank holiday and room conflicts produce `adminAlerts`, not engine failures.
- [ ] Therapist calendar shows only own appointments.

**Playwright tests: `scheduling.spec.ts`**
- Slot overlapping existing appointment with buffer not returned.
- Date in approved leave period not available.
- Request beyond `publicBookingWindowDays` returns error.
- Admin can book appointment. Appears in schedule.
- Booking a conflicting slot shows error.
- Booked appointment has `isManuallyModified: true`.
- Engine generates correct recurring appointments.
- Running engine twice does not create duplicates.
- Manually modified appointment unchanged after engine run.
- Paused client produces no new appointments.
- Admin can mark attendance.
- Therapist calendar shows only own appointments.

---

### Module 7: Invoicing and Billing

**What this delivers.** Invoice generation, late cancellation fees, credits, invoice overrides, and reminders. After this module, a practice can manage its full billing workflow.

**Demo stage delivers:**
- Invoice list at `/admin/invoices`. Filters by status, client, date range.
- Invoice detail view at `/admin/invoices/[id]`. Line items, VAT breakdown, payment status, reminder history.
- Invoice generation from appointment (shown on appointment detail).
- Late cancellation fee invoice (auto-generated indicator).
- Credit management UI on client record: purchase, apply, refund. Balance display.
- Void invoice flow with optional reason. Convert late cancellation to non-billable.
- Reset late fee counter (admin only).
- Reminder history display.

**Wired stage delivers:**
- `src/lib/services/invoice.service.ts`: full CRUD. VAT backwards formula. Counter document for invoice numbers. Recipient routing by billing arrangement.
- `src/lib/services/credit.service.ts`: `purchaseCredits`, `applyCredits`, `refundCredits`. Atomic balance and transaction writes.
- `src/lib/schemas/invoice.schemas.ts`.
- `src/lib/actions/invoice.actions.ts`.
- `src/lib/actions/credit.actions.ts`.
- Late cancellation auto-invoice. `lateFeeCount` increment. Alert at threshold.

**Acceptance criteria.**
- [ ] VAT calculation uses backwards formula.
- [ ] All financial values stored as integer pence.
- [ ] Invoice number format: `{prefix}-{year}-{sequence}`. Sequential, no gaps.
- [ ] Credit balance and transaction always written atomically.
- [ ] Balance never goes below zero.
- [ ] Voiding a late fee invoice decrements `lateFeeCount`.
- [ ] Reset late fee counter sets to zero. Logged to audit.
- [ ] Late fee alert created when threshold reached.
- [ ] Max reminders respected. Alert created after max.

**Playwright tests: `invoicing.spec.ts`**
- Invoice generated with correct amounts and VAT.
- Invoice number format correct. Sequential.
- Late cancellation generates invoice with `isLateFee: true`.
- `lateFeeCount` increments on client record.
- Alert created when threshold reached.
- Admin can add credit. Balance updates correctly.
- Credit applied to invoice reduces balance correctly.
- Voiding late fee invoice decrements `lateFeeCount`.
- Audit log contains void entry with reason.
- Reset counter sets `lateFeeCount` to zero.

---

### Module 8: Client Portal

**What this delivers.** Client dashboard, appointment views, invoice views, agreement views, settings, and PIN management. After this module, a client can self-serve through their portal. **Blocked on OQ1 for payment action only.** Payment placeholder built. Real payment wired when OQ1 resolved.

**Demo stage delivers:**
- Client dashboard using `PortalShell`. Upcoming appointments, outstanding invoices summary.
- Appointment list and detail view. Cancellation flow showing both paths (outside/inside window).
- Invoice list and detail view. Payment placeholder (balance due, no action button until OQ1 resolved).
- Signed agreements list and detail view with rendered content.
- Settings page: profile details, notification preferences, Quick Exit preferences, discreet comms toggle.
- PIN setup, change, and remove.
- `PinPrompt` on portal load if no PIN set.
- All views use portal-safe data only (no clinical fields visible).

**Wired stage delivers:**
- Portal pages connected to `getClientForPortal` (never `getClient`).
- Cancellation actions: outside window free, inside window shows two options.
- PIN setup, change, remove actions. Hash storage.
- Discreet comms toggle updates user record.
- `PinPrompt` dismissal persists.

**Acceptance criteria.**
- [ ] Portal view never contains clinical vault fields.
- [ ] Cancellation inside window shows two options (pay fee or contact practice).
- [ ] PIN hash stored in Firestore, not plaintext.
- [ ] PIN prompt dismissed with "Do not show again" persists.
- [ ] Discreet comms toggle persists.
- [ ] After PIN set, login requires PIN entry.
- [ ] Client cannot view another client's data.

**Playwright tests: `client-portal.spec.ts`**
- Client can view upcoming appointments.
- Portal response contains no clinical vault fields.
- Cancellation outside window succeeds without fee.
- Cancellation inside window shows fee option.
- Client can view own invoices. Cannot view another client's.
- Client can view own signed agreement. Unsigned not shown.
- Client can set PIN. Hash stored.
- PIN prompt dismissed persists.
- Discreet comms toggle persists.
- After PIN set, login requires PIN entry.

---

### Module 9: Responsible Person Portal

**What this delivers.** RP onboarding, portal views scoped to linked clients, and context switching. After this module, a responsible person can manage their linked client's non-clinical information. **Blocked on OQ6 for RP write permissions scope.**

**Demo stage delivers:**
- RP onboarding flow: same five-step safety wizard as client, adapted language.
- RP dashboard using `PortalShell`. Linked client appointments, invoices.
- `ContextSwitcher` in topbar when RP has multiple linked clients.
- Context switch loads different client's data.

**Wired stage delivers:**
- RP onboarding sets `onboarding.responsiblePerson: true`.
- Portal views scoped to linked client via service layer.
- Context switching loads correct client data.
- Permission flags checked for write operations (pending OQ6 resolution for exact scope).

**Acceptance criteria.**
- [ ] RP onboarding Step 4 cannot be skipped.
- [ ] `onboarding.responsiblePerson: true` set on completion.
- [ ] RP can view linked client appointments and invoices.
- [ ] RP cannot access unlinked client data.
- [ ] Context switch loads correct client's data.

**Playwright tests: `rp-portal.spec.ts`**
- RP reaches onboarding on first login.
- Step 4 cannot be skipped.
- Completion sets onboarding flag.
- RP can view linked client appointments.
- RP with two linked clients can switch context.
- RP cannot access unlinked client data.

---

### Module 10: Therapist Portal

**What this delivers.** Therapist dashboard, schedule view, client list, practice notes, and profile management. After this module, therapists have their own complete operational portal. **Blocked on OQ5 for invoice visibility.**

**Demo stage delivers:**
- Therapist dashboard using `StaffShell`. Today's appointments, urgent client notes.
- Schedule view: own appointments only. Attendance marking.
- Assigned clients list. Own clients only.
- Practice note creation on own clients.
- Profile management: biography, qualifications, specialisms, working hours.

**Wired stage delivers:**
- Dashboard connected to appointment and note services.
- Schedule scoped to own appointments only.
- Client list scoped to assigned clients only.
- Practice note creation restricted to own clients.
- Profile update actions.

**Acceptance criteria.**
- [ ] Therapist schedule shows only own appointments.
- [ ] Therapist can mark attendance.
- [ ] Therapist cannot view another therapist's schedule.
- [ ] Therapist client list shows only assigned clients.
- [ ] Therapist can add practice note to own client only.
- [ ] Therapist can update own biography and working hours.

**Playwright tests: `therapist-portal.spec.ts`**
- Therapist schedule shows only own appointments.
- Therapist can mark attendance.
- Therapist cannot view another therapist's schedule.
- Therapist client list shows only assigned clients.
- Therapist can add note to own client. Cannot add to another therapist's client.
- Therapist can update own biography. Working hours persist.

---

### Module 11: Admin Dashboard and Notifications

**What this delivers.** Admin dashboard with priority queue, and the notification system. **Blocked on OQ4 for exact dashboard content model.**

**Demo stage delivers:**
- Admin dashboard at `/admin`. Priority queue: unresolved alerts by severity (critical, warning, info). Pending onboarding actions. Overdue invoices count. Pending leave count. Each item links to relevant record.
- Notification panel in `NotificationBell` dropdown. Unread count. Mark as read and dismiss actions.

**Wired stage delivers:**
- `useNotifications` hook: polls every 60 seconds. Returns `notifications`, `unreadCount`, `markAsRead(id)`, `dismiss(id)`.
- Dashboard connected to alert, onboarding, invoice, and leave services.

**Acceptance criteria.**
- [ ] Critical alerts appear before warning alerts.
- [ ] Resolved alert does not appear in dashboard queue.
- [ ] Alert links navigate to correct record.
- [ ] Unread notifications show correct count on bell.
- [ ] Marking as read clears from unread count.
- [ ] Dismiss removes from panel.

**Playwright tests: `admin-dashboard.spec.ts`, `notifications.spec.ts`**
- Critical alerts before warning alerts.
- Resolved alert not in queue.
- Alert links navigate correctly.
- Unread count correct. Mark as read works. Dismiss works.

---

### Module 12: Waiting List

**What this delivers.** Public waiting list form and admin waiting list management. After this module, the practice can capture and manage waiting list enquiries.

**Demo stage delivers:**
- Public waiting list form at `/waiting-list` using `PublicShell`. `CrisisBox` on this page. Fields: name, email, phone, pathway, preferred therapist, brief reason, GDPR consent (required), notify preference.
- Admin waiting list view at `/admin/waiting-list`. Contact, convert, remove actions. Conversion creates client record preview.

**Wired stage delivers:**
- `src/lib/services/waitingList.service.ts`.
- `src/lib/schemas/waitingList.schemas.ts`.
- `src/lib/actions/waitingList.actions.ts`.
- Conversion creates client record with stage `enquiry_received`.

**Acceptance criteria.**
- [ ] `CrisisBox` present on public form page.
- [ ] GDPR consent required. Form cannot submit without it.
- [ ] Admin can view, contact, convert, and remove entries.
- [ ] Convert action creates client record with correct stage.

**Playwright tests: `waiting-list.spec.ts`**
- Form cannot submit without GDPR consent.
- Submission creates waiting list record.
- `CrisisBox` present in DOM.
- Admin can view entries.
- Convert creates client with `enquiry_received` stage.
- Remove updates status to `removed`.

---

### Module 13: Data Export

**What this delivers.** Client data export for admin and client self-service. After this module, data can be exported in compliance with GDPR subject access requests.

**Demo stage delivers:**
- Admin export action on client record. Format selector (JSON, Markdown, CSV, PDF).
- Client self-export action in portal settings. Format selector.
- Preview of what each export contains (admin includes clinical, client does not).

**Wired stage delivers:**
- `src/lib/services/export.service.ts`: `exportClient(clientId, format, requestedBy)`. Admin export includes clinical fields. Client self-export uses `getClientForPortal`.
- Export actions for admin and client.

**Acceptance criteria.**
- [ ] Admin export includes clinical vault fields.
- [ ] Client self-export never includes clinical vault fields.
- [ ] Export logged to `auditLog` with format and requesting user.

**Playwright tests: `export.spec.ts`**
- Admin export response contains clinical fields.
- Client self-export response contains no clinical fields.
- Export action creates audit log entry.

---

## Final Build Verification

When all modules are complete, run full verification:

```
- [ ] npm run dev starts without errors.
- [ ] npm run build completes without errors.
- [ ] TypeScript strict passes with zero errors.
- [ ] npm run lint passes with zero errors.
- [ ] All Playwright tests pass.
- [ ] Practice Setup route returns 404.
- [ ] Unregistered email cannot authenticate via any method.
- [ ] getClientForPortal never returns clinical vault fields (confirmed by test).
- [ ] PIN lock cannot be bypassed via magic link.
- [ ] All portals navigable and role-scoped correctly.
- [ ] All write operations produce audit log entries.
- [ ] No Firestore imports outside service files (grep confirms).
- [ ] No float financial values anywhere (grep confirms).
- [ ] No hardcoded colour values in component files (grep confirms).
- [ ] No native alert() or confirm() anywhere (grep confirms).
- [ ] isManuallyModified appointments unchanged after scheduling engine run.
- [ ] Scheduling engine is idempotent (confirmed by test).
- [ ] Firestore security rules deny all access not explicitly permitted.
- [ ] No demo data imports in any production code path.
```

---

## Open Questions Blocking Specific Modules

Do not start the blocked work until the question is resolved. Stop and ask.

| Question | Blocks |
|---|---|
| OQ1: Payment provider: Stripe, manual, or hybrid? | Module 8 payment action |
| OQ2: Email delivery provider for production | All invitation emails (emulator covers dev) |
| OQ3: Agreement signing: hash only or third-party e-signature? | Module 5 agreement detail |
| OQ4: Admin dashboard exact content and priority model | Module 11 |
| OQ5: Can therapist see invoice status for own clients? | Module 10 |
| OQ6: RP portal write permissions scope | Module 9 |

---

*MTN Therapy Practice Portal | Build Plan | v5.0 | 17 May 2026*
*More Than Normal, Canterbury.*
*Supersedes Build Plan v4.1.*
