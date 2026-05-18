# MTN Therapy Practice Portal
## Engineering Standards and Architecture
### Version 5.0 | 17 May 2026
### More Than Normal

---

## Purpose

This document defines how code is written for the MTN Therapy Practice Portal. Every decision about file structure, data flow, component architecture, authentication, error handling, validation, and testing is governed by what is written here.

Read this document fully before writing any code. These rules apply to every file in every layer without exception.

---

## Section 1. Absolute Rules
**Rule 0. Node v22+ Required.**
Node 22 or higher is mandatory for local development and build. (Enforced by firebase-admin v13 and Playwright 1.60+).

**Rule 1. One Firestore boundary per collection.**
Each Firestore collection has exactly one service file. That service file is the only place in the codebase that imports and calls Firestore for that collection. No component, page, Server Action, hook, or utility imports Firestore directly.

**Rule 2. Component files: 150 lines maximum. Page files: 100 lines maximum.**
Split before exceeding. A component needing more than 150 lines is doing too much.

**Rule 3. Every Server Action returns `ActionResult<T>`.**
No Server Action returns raw data, throws to the caller, or returns undefined.

**Rule 4. Every input validated with Zod before any service call.**
Server Actions validate with Zod schemas before calling any service function.

**Rule 5. Every write action calls `logAction`.**
Every function that creates, updates, or deletes a record calls `logAction` from `audit.service.ts`. A mutation without an audit log entry is incomplete.

**Rule 6. Pages compose. They do not implement.**
Page files contain no business logic, no data fetching logic, no inline styles.

**Rule 7. No native browser dialogs.**
No `alert()`, `confirm()`, or `prompt()`. All destructive confirmations use `ConfirmDialog`.

**Rule 8. Every module includes Playwright tests.**
Tests are written as part of the wired stage of each module. Tests that fail block sign-off. This is not optional.

**Rule 9. UI-first phased build.**
The project follows a phased lifecycle. Phase 1: Build the UI with demo data for all modules, pausing for QA after each. Phase 2: Wire the entire app to the service layer and test it end to end.

**Rule 10. Stop and ask rather than loop or guess.**
If a requirement is ambiguous or a problem cannot be resolved within two attempts, stop. Write a clear description of the blocker. Wait for input. Do not continue speculating or retrying. This rule exists because the build runs on a credit-based system. Wasted compute is wasted money.

**Rule 11. The design handoff rule.**
If a module requires a UI element not in the component library, stop. List missing components. Wait for instruction. Do not improvise.

---

## Section 2. Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                      # Role determination landing
│   ├── setup/
│   │   └── page.tsx                  # Practice Setup. Returns notFound() after completion.
│   ├── (auth)/
│   │   ├── layout.tsx                # AuthShell
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── activate/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx                # StaffShell with admin navigation
│   │   ├── page.tsx                  # Admin dashboard
│   │   ├── clients/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── _components/
│   │   ├── therapists/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── onboarding/
│   │   │   └── page.tsx
│   │   ├── schedule/
│   │   │   └── page.tsx
│   │   ├── invoices/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── agreements/
│   │   │   └── page.tsx
│   │   ├── waiting-list/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── therapist/
│   │   ├── layout.tsx                # StaffShell with therapist navigation
│   │   ├── page.tsx
│   │   ├── schedule/
│   │   │   └── page.tsx
│   │   ├── clients/
│   │   │   └── page.tsx
│   │   ├── leave/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── portal/
│   │   ├── layout.tsx                # PortalShell with client navigation
│   │   ├── page.tsx
│   │   ├── appointments/
│   │   │   └── page.tsx
│   │   ├── invoices/
│   │   │   └── page.tsx
│   │   ├── agreements/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── guardian/
│   │   ├── layout.tsx                # PortalShell with RP navigation
│   │   ├── page.tsx
│   │   ├── appointments/
│   │   │   └── page.tsx
│   │   ├── invoices/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── public/
│   │   ├── layout.tsx                # PublicShell
│   │   ├── book/
│   │   │   └── page.tsx
│   │   ├── waiting-list/
│   │   │   └── page.tsx
│   │   ├── onboard/
│   │   │   └── [token]/
│   │   │       └── page.tsx
│   │   └── sign/
│   │       └── [token]/
│   │           └── page.tsx
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── ui/                           # shadcn/ui primitives. Do not modify.
│   ├── shared/
│   │   ├── layout/
│   │   │   ├── StaffShell.tsx
│   │   │   ├── PortalShell.tsx
│   │   │   ├── PublicShell.tsx
│   │   │   ├── AuthShell.tsx
│   │   │   ├── NavDrawer.tsx
│   │   │   ├── RoleSwitcher.tsx
│   │   │   ├── ContextSwitcher.tsx
│   │   │   └── QuickExitFab.tsx
│   │   ├── forms/
│   │   │   ├── FormField.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── TextareaInput.tsx
│   │   │   ├── SelectInput.tsx
│   │   │   ├── RadioGroup.tsx
│   │   │   ├── CheckboxInput.tsx
│   │   │   ├── ToggleSwitch.tsx
│   │   │   ├── DateInput.tsx
│   │   │   ├── TimeInput.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   └── SubmitButton.tsx
│   │   ├── display/
│   │   │   ├── DataTable.tsx
│   │   │   ├── DetailCard.tsx
│   │   │   ├── SectionCard.tsx
│   │   │   ├── TabNav.tsx
│   │   │   ├── InlineAlert.tsx
│   │   │   ├── SkeletonBlock.tsx
│   │   │   ├── SkeletonTable.tsx
│   │   │   ├── PriceDisplay.tsx
│   │   │   └── DateTimeDisplay.tsx
│   │   ├── auth/
│   │   │   ├── PinEntry.tsx
│   │   │   ├── PinSetup.tsx
│   │   │   └── PinPrompt.tsx
│   │   ├── PageHeader.tsx
│   │   ├── EmptyState.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── FormError.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── DataCard.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── CrisisBox.tsx
│   │   ├── InlineAlert.tsx
│   │   └── OnboardingStageIndicator.tsx
│   └── dev/
│       └── DevToolbar.tsx            # Development only. Hidden via NODE_ENV check.
│
├── lib/
│   ├── firebase/
│   │   ├── config.ts                 # Client SDK. Never imported server-side.
│   │   ├── admin.ts                  # Admin SDK. Throws if called in browser.
│   │   └── auth.ts                   # Client auth helpers.
│   ├── services/
│   │   ├── audit.service.ts          # logAction only. Append-only.
│   │   ├── notification.service.ts
│   │   ├── user.service.ts
│   │   ├── practice.service.ts
│   │   ├── client.service.ts
│   │   ├── therapist.service.ts
│   │   ├── appointmentType.service.ts
│   │   ├── room.service.ts
│   │   ├── appointment.service.ts
│   │   ├── availability.service.ts
│   │   ├── leave.service.ts
│   │   ├── calendarBlock.service.ts
│   │   ├── bankHoliday.service.ts
│   │   ├── invoice.service.ts
│   │   ├── credit.service.ts
│   │   ├── agreement.service.ts
│   │   ├── token.service.ts
│   │   ├── responsiblePerson.service.ts
│   │   ├── billingContact.service.ts
│   │   ├── consent.service.ts
│   │   ├── practiceNote.service.ts
│   │   ├── waitingList.service.ts
│   │   ├── scheduling.service.ts
│   │   └── export.service.ts
│   ├── actions/
│   │   ├── auth.actions.ts
│   │   ├── setup.actions.ts
│   │   ├── client.actions.ts
│   │   ├── therapist.actions.ts
│   │   ├── appointment.actions.ts
│   │   ├── booking.actions.ts
│   │   ├── onboarding.actions.ts
│   │   ├── invoice.actions.ts
│   │   ├── credit.actions.ts
│   │   ├── agreement.actions.ts
│   │   ├── leave.actions.ts
│   │   ├── settings.actions.ts
│   │   └── waitingList.actions.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useRole.ts
│   │   └── useNotifications.ts
│   ├── schemas/
│   │   ├── auth.schemas.ts
│   │   ├── setup.schemas.ts
│   │   ├── client.schemas.ts
│   │   ├── therapist.schemas.ts
│   │   ├── appointment.schemas.ts
│   │   ├── invoice.schemas.ts
│   │   ├── agreement.schemas.ts
│   │   ├── leave.schemas.ts
│   │   ├── settings.schemas.ts
│   │   ├── waitingList.schemas.ts
│   │   └── common.schemas.ts
│   ├── demo/
│   │   └── data.ts                   # Demo data for UI stage. See Section 16.
│   ├── types.ts
│   ├── utils.ts
│   └── constants.ts
│
├── __tests__/
│   └── e2e/
│       ├── auth-middleware.spec.ts
│       ├── auth-login.spec.ts
│       ├── setup.spec.ts
│       ├── admin-settings.spec.ts
│       ├── therapist-management.spec.ts
│       ├── client-management.spec.ts
│       ├── onboarding-pipeline.spec.ts
│       ├── scheduling.spec.ts
│       ├── invoicing.spec.ts
│       ├── client-portal.spec.ts
│       ├── rp-portal.spec.ts
│       ├── therapist-portal.spec.ts
│       ├── admin-dashboard.spec.ts
│       ├── waiting-list.spec.ts
│       └── export.spec.ts
│
└── config/
    ├── tenant.config.ts
    └── brand.config.json
```

---

## Section 3. Firebase Architecture

### 3.1 Three Firebase files

**`src/lib/firebase/config.ts`**
Firebase client SDK. Initialised from environment variables. Singleton. Never imported by Server Actions, service files, or middleware. Only imported by `auth.ts` and client-side hooks.

**`src/lib/firebase/admin.ts`**
Firebase Admin SDK. Server-side only. Throws descriptive error at import time if `typeof window !== 'undefined'`. Only imported by service files. Never by components, hooks, or pages.

```typescript
// src/lib/firebase/admin.ts
import { getApps, initializeApp, cert } from 'firebase-admin/app'

if (typeof window !== 'undefined') {
  throw new Error(
    'firebase/admin.ts must not be imported in browser context. ' +
    'This file is for server-side use only.'
  )
}

export function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]!
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export function getAdminDb() {
  const { getFirestore } = require('firebase-admin/firestore')
  return getFirestore(getAdminApp())
}
```

**`src/lib/firebase/auth.ts`**
Client auth helpers. Imports client config only. Exports `signInWithMagicLink`, `signInWithGoogle`, `signOut`, `onAuthStateChanged`.

### 3.2 Firestore service pattern

Each collection: one service file, one Firestore import point.

```typescript
// src/lib/services/client.service.ts
import { getAdminDb } from '@/lib/firebase/admin'
import type { ClientDocument, PortalSafeClient } from '@/lib/types'

const db = () => getAdminDb()

export async function getClientForPortal(
  id: string
): Promise<PortalSafeClient | null> {
  const doc = await db().collection('clients').doc(id).get()
  if (!doc.exists) return null
  const data = { id: doc.id, ...doc.data() } as ClientDocument
  // Clinical vault fields are destructured and discarded.
  // They are never assigned to a variable or passed anywhere.
  const {
    previousTherapyHistory,
    presentingIssues,
    currentMedication,
    safeguarding,
    ...safe
  } = data
  return safe
}
```

### 3.3 Forbidden Firestore imports

```typescript
// FORBIDDEN — anywhere except service files
import { getFirestore } from 'firebase/firestore'
import { getFirestore } from 'firebase-admin/firestore'
import { collection, doc, getDoc } from 'firebase/firestore'
```

Verify with grep before marking any module complete:
```bash
grep -r "from 'firebase/firestore'" src/ --include="*.ts" --include="*.tsx" \
  | grep -v "lib/services"
# Must return no results
```

---

## Section 4. Authentication and Middleware

### 4.1 Middleware logic

`src/middleware.ts` runs on every request to protected route groups.

```
Verify Firebase session cookie
    ↓
Fetch Firestore user record
    ↓
Determine currentRole from session state
    ↓
Check status[currentRole]
    ↓
If 'active':
    Check onboarding[currentRole]
        If false: redirect to role-specific onboarding
        If true: proceed
    ↓
If not active or no currentRole:
    Find all roles where status === 'active'
        One active role: set currentRole, proceed
        Multiple active roles: redirect to role selection screen
        No active roles: terminate session, show inactive message
```

### 4.2 Session management

Firebase Auth session cookies. Set on successful authentication. Verified by middleware on every protected request. Default duration: 14 days.

### 4.3 No self-registration

Firebase Admin SDK is the only path to account creation. The client SDK `createUserWithEmailAndPassword` is never called from any application code. Verify with grep:

```bash
grep -r "createUserWithEmailAndPassword" src/ --include="*.ts" --include="*.tsx"
# Must return no results
```

---

## Section 5. The Data Flow

```
UI Component
    ↓ calls
Server Action  (src/lib/actions/)
    ↓ validates with Zod, calls
Domain Service  (src/lib/services/)
    ↓ calls
Firestore via Firebase Admin SDK
```

Each layer has one responsibility. Nothing crosses layer boundaries.

---

## Section 6. Server Action Pattern

```typescript
'use server'

import { z, safeParse } from 'zod'
import { ok, fail } from '@/lib/utils'
import { someSchema } from '@/lib/schemas/some.schemas'
import * as someService from '@/lib/services/some.service'
import { logAction } from '@/lib/services/audit.service'
import { getCurrentUser } from '@/lib/firebase/auth'
import type { ActionResult, SomeType } from '@/lib/types'

export async function createSomethingAction(
  formData: FormData
): Promise<ActionResult<SomeType>> {

  // 1. Validate first. Always.
  const parsed = safeParse(someSchema, Object.fromEntries(formData))
  if (!parsed.success) {
    return fail(
      'Please check the form for errors.',
      parsed.error.flatten().fieldErrors as Record<string, string>
    )
  }

  try {
    // 2. Call service.
    const result = await someService.createSomething(parsed.data)

    // 3. Log action. Always on successful write.
    const user = await getCurrentUser()
    await logAction({
      userId: user.id,
      userRole: user.currentRole,
      action: 'something.created',
      resourceType: 'something',
      resourceId: result.id,
    })

    // 4. Return result.
    return ok(result)

  } catch (error) {
    console.error('createSomethingAction:', error)
    return fail('Something went wrong. Please try again.')
  }
}
```

---

## Section 7. Automated Testing Standards

### 7.1 Testing stack

- Playwright for all end-to-end tests.
- Firebase Auth Emulator and Firestore Emulator for test isolation.
- Tests in `src/__tests__/e2e/`.
- One test file per module.
- Chromium only.

### 7.2 Emulator configuration

```json
// firebase.json
{
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "ui": { "enabled": true }
  }
}
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './src/__tests__/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    browserName: 'chromium',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
})
```

### 7.3 Test seed helpers

Every test suite uses a seed helper to create test users and data in the emulator before tests run, and clean up after.

```typescript
// src/__tests__/e2e/helpers/seed.ts
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Connect to emulators
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'

export async function seedTestAdmin(): Promise<{ uid: string; email: string }> {
  // Creates test admin user in emulator
}

export async function seedTestClient(): Promise<{ uid: string; email: string }> {
  // Creates test client user in emulator
}

export async function cleanupTestData(uids: string[]): Promise<void> {
  // Removes test records from emulator
}
```

### 7.4 What every module test covers

- Happy path: primary user journey works end to end.
- Auth boundary: unauthenticated access to protected routes is blocked.
- Role boundary: wrong role cannot access the feature.
- Empty state: feature renders correctly with no data.
- Error state: service failure produces visible, actionable error.
- Validation: invalid form input produces correct field-level errors.

### 7.5 What tests do not cover

- Visual regression.
- Pixel-perfect layout.
- Performance benchmarks.
- Browser compatibility beyond Chromium.
- Exhaustive edge cases for every input combination.

### 7.6 Clinical isolation test

This test must exist and must pass. It is not optional.

```typescript
// In client-management.spec.ts
test('getClientForPortal response does not contain clinical vault fields', async () => {
  // Seed a client with clinical vault data in Firestore emulator
  // Call the portal-facing endpoint
  // Assert that response body contains no clinical vault field names
  const clinicalFields = [
    'previousTherapyHistory',
    'presentingIssues',
    'currentMedication',
    'safeguarding',
  ]
  for (const field of clinicalFields) {
    expect(JSON.stringify(response)).not.toContain(field)
  }
})
```

---

## Section 8. TypeScript Standards

Strict mode throughout. Handle null and undefined explicitly.

All interfaces in `src/lib/types.ts`. Local types prefixed with `Local`.

**Financial values: integers in pence. No floats. Ever.**

```typescript
// CORRECT
const feePence: number = 7500

// FORBIDDEN
const fee: number = 75.00

// VAT — always backwards from total, never added on top
const vatPence = Math.round(totalPence - (totalPence / (1 + vatRate)))
```

---

## Section 9. Component Architecture

Server Components by default. Apply `'use client'` only when the component genuinely needs React state, effects, or browser APIs.

Props interface named `[ComponentName]Props` defined immediately above the component.

Route-specific components in `_components/` folder adjacent to their route.

---

## Section 10. Zod Validation Standards

One schema file per domain. Use `safeParse` in actions, never `parse`. Error messages are user-facing in plain UK English. Field error keys must match form field names exactly.

Financial fields:
```typescript
export const penceSchema = z.number().int().positive()
```

Common schemas in `common.schemas.ts`:
```typescript
export const ukPostcodeSchema = z.string().pattern(/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i)
export const ukPhoneSchema = z.string().pattern(/^(\+44|0)[\d\s]{9,13}$/)
export const dateStringSchema = z.string().pattern(/^\d{4}-\d{2}-\d{2}$/)
export const isoTimestampSchema = z.string().datetime()
export const penceSchema = z.number().int().positive()
```

---

## Section 11. Error Handling

User-facing errors: return in `ActionResult` with clear, calm message. Never use language that implies blame.

System errors: `console.error` with context. Generic calm message to user.

Error boundaries: `error.tsx` at every meaningful route level. Portal error boundaries include Quick Exit button.

Loading states: every async operation shows a loading state. `SkeletonTable` or `SkeletonBlock` for data. `SubmitButton` loading state for forms. Never freeze the UI.

---

## Section 12. Audit Service

```typescript
// Append-only. No delete method. No update method.
// Every write operation in every service and action calls this.
export async function logAction(params: {
  userId: string
  userRole: string
  action: string        // dot-notation: 'client.created', 'invoice.voided'
  resourceType: string
  resourceId: string
  detail?: Record<string, unknown>
}): Promise<void> {
  await getAdminDb().collection('auditLog').add({
    ...params,
    timestamp: new Date().toISOString(),
  })
}
```

---

## Section 13. Accessibility Requirements

- All text meets WCAG 2.1 AA contrast in both light and dark modes.
- All form fields have associated labels via `htmlFor` and `id`.
- All errors linked via `aria-describedby`.
- All modals trap focus while open, return focus to trigger on close.
- All interactive elements keyboard navigable.
- All images have `alt` attribute.
- Colour never the only carrier of meaning.
- Reduced motion respected via `prefers-reduced-motion`.
- One `h1` per page.
- Quick Exit FAB reachable by keyboard at all times.

---

## Section 14. UK English

All user-facing strings, code comments, labels, and error messages use UK English. Colour not color. Organisation not organization. Recognise not recognize. Sentence case in labels, not title case.

---

## Section 15. Grep Verification Commands

Run these before marking any module complete. Zero results required.

```bash
# No Firestore imports outside service files
grep -r "from 'firebase/firestore'" src/ --include="*.ts" --include="*.tsx" | grep -v "lib/services"
grep -r "from 'firebase-admin/firestore'" src/ --include="*.ts" --include="*.tsx" | grep -v "lib/firebase/admin"

# No self-registration
grep -r "createUserWithEmailAndPassword" src/ --include="*.ts" --include="*.tsx"

# No native browser dialogs
grep -r "window\.alert\|window\.confirm\|window\.prompt" src/ --include="*.ts" --include="*.tsx"

# No float financial values (catches obvious cases)
grep -r "\bfee\s*=\s*[0-9]*\.[0-9]" src/ --include="*.ts" --include="*.tsx"

# No hardcoded hex colours in component files
grep -r "#[0-9a-fA-F]\{3,6\}" src/components/ --include="*.tsx" --include="*.ts"
```

---

## Section 16. The Module Lifecycle

This is the build pattern for every module. It replaces the previous chunk protocol. The developer decides how to split the internal work. What matters is that each stage is completed and verified before progressing to the next.

### The two phases

The build happens in two global phases rather than strictly per-module stages.

**Phase 1: App-Wide Demo.**
Build all pages, layouts, and components for every module. Pass hardcoded demo data as props. No service calls, no Server Actions, no Firestore reads or writes. We work module by module, pausing for a visual review and QA sign-off after each module's UI is built.

**Phase 2: App-Wide Wired.**
Once Phase 1 is fully complete for the entire app, replace demo data with real service calls. Write Zod schemas, service files, Server Actions, and hooks. Connect components to the data layer. Write Playwright tests. Run grep verification.

### Why this order

The demo stage catches layout problems, missing states, confusing flows, and design gaps before any backend work exists. Fixing a UI problem in a component that takes static props is trivial. Fixing the same problem after it is entangled with service calls, action state, and error handling is expensive.

It also means Alex can review and sign off the UI without needing to authenticate, seed data, or debug connectivity. Open the browser, switch roles in the dev toolbar, and see every screen.

### Demo data rules

- Demo data is typed. Every demo object satisfies its TypeScript interface.
- Demo data is realistic. Use plausible UK names, Canterbury-area postcodes, realistic appointment times, and sensible financial values (in pence).
- Demo data covers every visible state. If a component can show "no items", "loading", "3 items", and "error", the demo data file provides constants for each.
- Demo data lives in one file: `src/lib/demo/data.ts`. It is not scattered across components.
- Demo data imports are removed during the wired stage. The file remains in the codebase for future reference but is not imported by any production code after wiring.

### Module completion report format

At the end of every module (after the wired stage), produce a report in this format:

```
MODULE [name] COMPLETION REPORT

Demo stage:
- Pages built: [list]
- Components built: [list]
- States verified: populated, empty, loading, error
- Demo review: PASS / AWAITING REVIEW

Wired stage:
- Schemas written: [list]
- Services written: [list]
- Actions written: [list]
- Hooks written: [list]
- Firestore security rules updated: YES / NO / N/A

Verification:
- [test item]: PASS / FAIL
- Grep checks: PASS / FAIL
- TypeScript strict: PASS / FAIL

Playwright tests written: [list test file names]
Playwright tests passing: YES / NO / PARTIAL

Issues encountered:
- [description of any problem and how it was resolved]

Blockers requiring human input:
- [description if any, otherwise NONE]

Module sign-off: READY / BLOCKED
```

---

## Section 17. Pre-Module Verification Checklist

Before producing a module completion report, check every item. Fix silently before reporting. Do not mark items as passing if they are not.

- [ ] No component, page, action, or hook imports Firestore directly.
- [ ] All Server Actions return `ActionResult<T>`.
- [ ] All Server Actions validate with Zod before service calls.
- [ ] All write actions call `logAction`.
- [ ] Firestore security rules updated for any new collection access.
- [ ] No hardcoded colour, spacing, or radius values in component files.
- [ ] All interactive elements keyboard accessible.
- [ ] All icon-only buttons have `aria-label`.
- [ ] All form fields correctly labelled with `aria-describedby` for errors.
- [ ] All async operations show loading states.
- [ ] No component file exceeds 150 lines.
- [ ] No page file exceeds 100 lines.
- [ ] No `alert()`, `confirm()`, or `prompt()` anywhere.
- [ ] No float financial values anywhere.
- [ ] No `createUserWithEmailAndPassword` anywhere.
- [ ] All Playwright tests for this module written and passing.
- [ ] UK English in all user-facing strings and comments.
- [ ] TypeScript strict passes with zero errors.
- [ ] Grep verification commands return no unexpected results.
- [ ] Demo data imports removed from all production code paths.

---

## Section 18. Anti-Patterns

```typescript
// FORBIDDEN — Firestore import in component
import { getFirestore } from 'firebase/firestore'

// FORBIDDEN — Firestore import in Server Action
import { getFirestore } from 'firebase-admin/firestore'

// FORBIDDEN — clinical fields returned to portal
const client = await getClient(id) // Use getClientForPortal instead

// FORBIDDEN — float financial value
const fee = 75.00

// FORBIDDEN — hardcoded colour
<div style={{ color: '#1a252f' }}>

// FORBIDDEN — native dialog
if (confirm('Sure?')) { deleteItem() }

// FORBIDDEN — missing logAction
await clientService.updateClient(id, data)
return ok(undefined) // No audit trail

// FORBIDDEN — self-registration
await createUserWithEmailAndPassword(auth, email, password)

// FORBIDDEN — looping on a failed approach
// If two attempts have not resolved the problem, stop and ask.
// Do not try a third, fourth, or fifth approach speculatively.

// FORBIDDEN — demo data imported in wired code
import { demoClients } from '@/lib/demo/data' // Only allowed during demo stage
```

---

*MTN Therapy Practice Portal | Engineering Standards | v5.0 | 17 May 2026*
*More Than Normal, Canterbury.*
*Supersedes Engineering Standards v4.1.*
