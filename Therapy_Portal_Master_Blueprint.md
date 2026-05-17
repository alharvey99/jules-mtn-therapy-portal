# MTN Therapy Practice Portal
## Master Blueprint
### Version 4.0 | 17 May 2026
### More Than Normal

---

## Purpose

This is the single source of truth for the MTN Therapy Practice Portal. It defines what the product is, who uses it, how they access it, what data it stores, and what rules govern its behaviour.

All other documents (Design System, Engineering Standards, User Journey Report, Scope Living Document) derive from this one. When there is a conflict between this document and any other, this document wins.

---

## Section 1. The Product

The MTN Therapy Practice Portal is a whitelabel practice management application for independent therapy practices across the UK. It is built once and deployed per practice as a fully isolated instance. Each practice has their own Firebase project, Firestore database, Firebase Authentication configuration, hosting environment, and domain.

The product manages the operational layer around therapy: scheduling, billing, agreements, onboarding, client self-service, and practice management. It is not a clinical notes system. It does not store therapy session content. It does not provide telehealth or video calling. Therapists keep their clinical notes in their own systems.

---

## Section 2. The Deployment Model

Each practice deployment is a fork of the master codebase configured for that tenant. No shared database. No multi-tenant architecture. One Firebase project per practice. Each practice owns their own infrastructure entirely.

**Practice Setup Process.**
On first load of a new deployment, if no practice document exists in Firestore, the application runs the Practice Setup wizard. This wizard:
- Is accessible only at `/setup`.
- Returns a hard 404 after completion. Not a redirect. The route ceases to exist.
- Cannot be triggered again under any circumstances once completed.
- Step 1 (mandatory): enter the email address for the first admin user. Firebase Auth account is created. Invitation email sent.
- Subsequent steps (modular, added during build): practice name, policy defaults, appointment types, branding. All skippable except Step 1. Skipped steps are configurable later in settings.

If all admin accounts are disabled in an emergency, recovery is handled exclusively at the Firebase console and Firestore level. There is no in-app recovery path.

---

## Section 3. The User Model

Five user contexts. All access is invitation-only. No self-registration exists anywhere in the application.

### 3.1 Practice Admin
Created by MTN during initial deployment (first admin) or by another admin via the portal. Full operational access across all practice data, settings, and workflows. The only role that can override fees, void invoices, reset late fee counters, unlock PIN-locked accounts, and amend billing arrangements.

### 3.2 Therapist
Created by admin via invitation flow in the Therapists view. Scoped to own clients and appointments only. Cannot see other therapists' data. Can submit leave, mark attendance, add practice notes to own clients, and manage own profile and working hours.

### 3.3 Client
Created via the onboarding invitation flow triggered by admin. Scoped to own non-clinical record only. Can view appointments, invoices, and agreements. Can manage own portal settings including PIN, discreet communications preferences, and Quick Exit configuration.

### 3.4 Responsible Person
Created via a separate invitation flow triggered by admin. One responsible person per client. Scoped to their linked client's non-clinical information only. Never sees clinical fields or practice notes. Permission flags on their record control whether they can manage appointments and invoices on the client's behalf. Both default to true. Admin can set either to false per RP record.

### 3.5 Public Visitor
Unauthenticated. Can submit a booking enquiry, view available slots, and join the waiting list. No portal access until onboarding is complete and an invitation has been sent and accepted.

---

## Section 4. Account Creation and Invitation Model

### 4.1 How accounts are created

| Role | Who creates it | How |
|---|---|---|
| First Admin | MTN | Via Practice Setup wizard on first deployment |
| Admin | Existing Admin | Via Add Admin flow in portal settings |
| Therapist | Admin | Via Add Therapist flow in Therapists view |
| Client | Admin | Via onboarding pipeline, triggered after assessment |
| Responsible Person | Admin | Via Add Responsible Person flow on client record |

No other account creation path exists. The Firebase client SDK `createUserWithEmailAndPassword` method is never called from the application. All account creation uses the Firebase Admin SDK via Server Actions or Cloud Functions.

### 4.2 The invitation flow

When admin creates any user account:

1. Admin enters the user's email address and name.
2. A Firebase Auth account is created immediately with that email as the identifier (Admin SDK).
3. A Firestore user record is created with the same UUID, linked role, and `onboarding[role]: false`.
4. A magic link sign-in email is generated and sent automatically.
5. The magic link expires after 72 hours.
6. If unused after 72 hours, admin sees a "Resend Invitation" option on the relevant record.
7. Resending generates a new magic link and invalidates the previous one.

### 4.3 Authentication methods

No passwords. Ever. Two authentication methods only:

**Magic Link.** Available to all roles. A sign-in link is sent to the registered email address. Single use. 72 hour expiry. The user clicks the link and is authenticated automatically.

**Google SSO.** Available when the registered email address is a Gmail address. Firebase matches the Google account to the registered email. Not available for non-Gmail addresses.

The login page has no sign-up link, no register button, and no create account path. Attempting to sign in with an unregistered email via any method fails with a generic message that does not confirm whether the email exists.

### 4.4 Email address changes

In v1, only admin can change a user's email address. Admin updates both the Firebase Auth email and the Firestore user record in a single Server Action. The user receives a notification at both the old and new email address.

---

## Section 5. The PIN Model

PIN is available to Client and Responsible Person roles only. It is a session protection layer, not an authentication method.

**Purpose.** To protect vulnerable users whose abusers may have access to their email address. After successful Firebase authentication, the PIN provides a second barrier that cannot be bypassed via email.

**Setup.** PIN is set once in profile settings. Optional. Not mandatory. After first login, if no PIN is set, a prompt encourages setup. The prompt has a "Do not show again" toggle which sets `pinPromptDismissed: true` on the user record.

**Session flow when PIN is set:**
```
Magic link or Google SSO succeeds
    ↓
PIN entry screen shown
    ↓
Correct PIN: portal loads
Incorrect PIN: attempt count increments
Three failed attempts: account PIN-locked
    ↓
PIN-locked state:
    Session terminated immediately
    pinLocked: true set on user record
    Client sees: "Your account has been locked.
    Please contact your practice to unlock it."
    No email sent. No magic link offered. No automated recovery.
    ↓
Unlock: admin or therapist only
    Unlock button on client/RP record
    Resets pinLocked to false, pinAttempts to 0
    Logged to audit trail
```

**PIN storage.** Stored as a bcrypt hash on the user record. Never plaintext. Never transmitted.

**PIN recovery.** No automated recovery path. Recovery requires a human at the practice to unlock the account. This is intentional. Magic link recovery would void the protection for users whose abusers have email access.

---

## Section 6. The Discreet Communications Model

Available to Client role. Configurable by client in portal settings. Two layers.

**Layer 1: `discreetComms` boolean on ClientDocument.**
When true:
- All system emails use a neutral sender name configured by the practice (e.g. "Your Appointment" not "Canterbury Therapy Practice").
- Email subject lines contain no reference to therapy, mental health, or the practice name.
- Email body contains minimal identifying information: appointment time and a link only.

**Layer 2: Portal display.**
When discreet comms is enabled:
- Portal header shows no practice name or logo.
- A neutral label is shown, configurable by practice (e.g. "My Portal").

Neither layer affects portal content. Both are controlled by the client. Admin can see the client's preference on the client record but cannot override it.

---

## Section 7. The Role and Status Model

### 7.1 Role status per user

Every user has a status value per role, not a single global status:

```typescript
status: {
  admin: 'active' | 'inactive' | 'archived'
  therapist: 'active' | 'inactive' | 'archived'
  client: 'active' | 'inactive' | 'archived'
  responsiblePerson: 'active' | 'inactive' | 'archived'
}
```

A user may have an archived responsible person role and an active client role simultaneously. Role status is independent per role.

### 7.2 Firebase Auth and deactivation

Firebase Auth accounts are not deleted when a user is deactivated. Active status is enforced at the Firestore middleware layer. On every authenticated request, middleware checks the active status of the current role. If inactive or archived, the session is terminated.

### 7.3 Middleware logic

```
Get authenticated Firebase user
    ↓
Fetch Firestore user record
    ↓
Determine current role from session state
    ↓
Check status[currentRole]
    ↓
If 'active': proceed
    ↓
If not active, or no current role set:
    Find all roles where status === 'active'
        ↓
    If one active role: set currentRole, proceed
        ↓
    If multiple active roles: show role selection screen,
        user selects, set currentRole, proceed
        ↓
    If no active roles: terminate session,
        show "Your account is inactive.
        Please contact your practice."
```

The role selection screen appears only when automatic role determination fails. Normal logins with a valid last role state go straight through.

### 7.4 Role switcher

The role switcher is present in every portal shell for users with more than one active role.

**Staff shell** (Admin and Therapist portals share this shell): switcher toggles between admin and therapist views.

**Non-staff shell** (Client and Responsible Person portals share this shell): switcher toggles between client and RP views.

The role switcher only displays roles where `status === 'active'`. Inactive or archived roles never appear as options.

### 7.5 Context switcher

Separate from the role switcher. Present in the Responsible Person view only. Allows a responsible person to switch between linked clients. Up to any number of linked clients supported. Each context switch loads the portal view scoped to the selected client.

### 7.6 Default role on login

| User's active roles | Default |
|---|---|
| Admin only | Admin view, always |
| Therapist only | Last state |
| Admin and Therapist | Admin view, always |
| Client only | Last state |
| Responsible Person only | Last state |
| Client and Responsible Person | Last state |
| Any combination including Admin | Admin view, always |

### 7.7 Onboarding flag per role

Every user record carries an onboarding completion flag per role:

```typescript
onboarding: {
  admin: boolean
  therapist: boolean
  client: boolean
  responsiblePerson: boolean
}
```

All flags default to false when a role is assigned. On login, after role is determined, the system checks `onboarding[currentRole]`. If false, the onboarding flow for that role runs. If true, the normal portal loads. This handles multi-role users cleanly: a responsible person who becomes a client completes client onboarding without re-running RP onboarding.

---

## Section 8. The Locked Product Features

These features are always on in every tenant deployment. They cannot be disabled by tenant configuration.

- Quick Exit FAB present in all client and RP portal shells. Client can toggle visibility in settings.
- First-login onboarding flow per role. Mandatory until complete.
- Clinical field isolation. No configuration can expose clinical fields to client or RP portal views.
- Audit log. Every write action logged. Cannot be disabled.
- `schedulingPaused` defaults to true on client creation. Cannot be changed as a system default.
- Invoice write-off and fee override require admin role. Cannot be delegated.
- `isManuallyModified` on appointments is permanent once set.
- All destructive actions require `ConfirmDialog`. Native browser dialogs forbidden.
- PIN lock recovery requires admin or therapist. No automated recovery path.
- Practice Setup route returns 404 after completion. Cannot be re-enabled.

---

## Section 9. The Data Model

24 collections. Full TypeScript interfaces in `MTN_Portal_Type_Definitions_v4.ts`.

### 9.1 Core entities

**`practices`**
Root document per tenant. Identity, contact, address, and all policy configuration.

Key fields: `name`, `slug`, `email`, `phone`, `address`, `timezone` (default `Europe/London`), `cancellationWindowHours` (default 24), `lateFeeAmountPence`, `bufferMinutes` (default 10), `publicBookingWindowDays` (default 14), `lateFeeAlertThreshold` (default 3), `maxInvoiceReminders` (default 3), `invoiceReminderIntervalDays` (default 7), `leaveApprovalPolicy`, `invoicePrefix` (default `INV`), `invoiceStartNumber` (default 1), `clientRefPrefix` (default `CHR`), `quickExitDefaultUrl` (default `https://www.bbc.co.uk`), `vatSettings`, `retentionYears` (default 7), `minorRetentionUntilAge` (default 25), `practiceSetupComplete` (boolean), `discreetCommsNeutralName` (string, e.g. "My Portal").

**`users`**
Every authenticated user. Roles array supports multi-role users.

Key fields: `roles`, `status` (per-role status object), `onboarding` (per-role boolean object), `firstName`, `lastName`, `email`, `notificationPreferences`, `quickExitEnabled` (default true), `quickExitUrl`, `invoiceReminderOverride`, `maxInvoiceReminders`, `invoiceReminderIntervalDays`, `pinHash`, `pinLocked` (default false), `pinAttempts` (default 0), `pinPromptDismissed` (default false), `lastRole`, `discreetComms` (client role only).

**`therapistProfiles`**
Therapist-specific operational data. One per therapist user.

Key fields: `userId`, `practiceId`, `workingHours`, `status`, `biography`, `qualifications`, `specialisms`.

### 9.2 Client and family data

**`clients`**
Main non-clinical client record.

Key fields: `clientRef`, `clientType`, `status`, `onboardingStage`, `assignedTherapistId`, personal details, `portalVisibility`, `discreetComms`, `schedulingPaused` (default true), `recurringSchedule`, `creditBalance` (integer pence, default 0), `creditCarryForwardPreference`, `sessionFeeOverridePence`, `lateFeeCount` (default 0), `invoiceReminderOverride`, `archivedBy`, `archiveReason`, `archivedAt`, `retentionExpiresAt`.

Clinical vault fields (never returned by any portal-facing function): `previousTherapyHistory`, `presentingIssues`, `currentMedication`, `safeguarding`.

**`responsiblePersons`** — one responsible person per client. One RP per client enforced at the service layer. Creating a new RP replaces any existing RP for that client. Two permission flags control what the RP can do in their portal: `canManageAppointments` (default true, allows booking, cancelling, rescheduling on client's behalf) and `canManageInvoices` (default true, allows paying invoices on client's behalf). Admin sets both flags per RP record. Service layer checks flags before allowing write operations from RP portal.
**`billingContacts`** — third-party payers for any client type.
**`consents`** — audit trail of every consent given or withdrawn.
**`practiceNotes`** — admin and therapist operational notes. Never visible to client or RP.
**`couplesEnquiries`** — links two client records for couples therapy.
**`waitingList`** — prospective clients when no slots are available.

### 9.3 Therapy operations

**`appointments`** — every appointment. Supports individual, group, couples via `clientIds` array.
**`appointmentTypes`** — service blueprints with duration, fee, buffer, modality, VAT applicability.
**`rooms`** — physical spaces. Capacity determines group session maximum.
**`leaveRecords`** — therapist leave with approval workflow.
**`calendarBlocks`** — admin-created blocks for closures and maintenance.
**`bankHolidays`** — UK bank holidays reference by year and region.

### 9.4 Agreements

**`agreementTemplates`** — active and historic templates with version history via `supersededAt` and `supersededBy`.
**`therapyAgreements`** — signed agreements per client with content hash.

### 9.5 Financial

**`invoices`** — all invoices. VAT-inclusive pricing. `reminderCount` and `reminderSentAt` tracked per invoice.
**`creditTransactions`** — append-only audit trail of all credit movements.

### 9.6 Communication and system

**`onboardingTokens`** — single-use expiring tokens stored as SHA-256 hashes.
**`notifications`** — per-user per-role in-app notifications polled every 60 seconds.
**`auditLog`** — append-only write action log. Never edited. Never deleted.
**`adminAlerts`** — practice-level operational issues requiring admin attention.

---

## Section 10. The Onboarding Lifecycle

Ten sequential stages tracked by `onboardingStage` on the client record. Each stage gates the next.

| Stage | Key action |
|---|---|
| `enquiry_received` | Public form submitted. Admin reviews. |
| `assessment_booked` | Initial assessment appointment created. |
| `extended_form_sent` | Extended form token generated and sent. |
| `extended_form_complete` | Client submits extended form. |
| `assessment_complete` | Admin marks assessment done. |
| `agreement_sent` | Agreement rendered and token sent. |
| `agreement_accepted` | Client signs agreement. |
| `portal_invite_sent` | Invitation token generated and sent. |
| `portal_active` | Client activates account. |
| `onboarding_complete` | Role onboarding flow complete. Client active. |

---

## Section 11. The Client Status Lifecycle

`enquiry` → `active` → `paused` → `archived`

On archive: portal access disabled, recurring schedule cleared, future appointments and unpaid invoices surfaced for admin handling, credit balance handled per `creditCarryForwardPreference`, `retentionExpiresAt` calculated, `archivedBy` and `archiveReason` recorded.

---

## Section 12. The Scheduling Engine

Runs daily at 08:00 in production via Firebase Scheduled Cloud Function. Five absolute rules:

1. `isManuallyModified: true` appointments are never touched by the scheduler. Permanent.
2. Fortnightly cadence calculated from `activeFrom` anchor only. Pause does not move the anchor.
3. Idempotent. Running twice produces the same result as running once.
4. Partial failures do not abort the run. One client's error does not stop others.
5. Conflict detection uses `slotEndTime` not `endTime`. Buffer always included.

Buffer calculation: `appointmentType.bufferMinutes ?? practice.bufferMinutes`.

---

## Section 13. The Cancellation and Reschedule Policy

**Outside cancellation window:** client cancels or reschedules freely. No fee.

**Inside cancellation window:** portal shows two options:
- Pay the late fee and proceed. Invoice generated, routed to billing contact if applicable.
- Contact the practice. Goes to admin queue for manual handling.

`cancellationReason` is optional freetext on all paths. Never required. Never gates any action.

**Admin overrides:**
- Void invoice: optional `voidReason`. Decrements `lateFeeCount` if it was a late fee invoice.
- Convert to non-billable: voids invoice, decrements `lateFeeCount`.
- Reset late fee counter: sets `lateFeeCount` to zero. Logged to audit.

**Late fee alert:** when `lateFeeCount` reaches `practice.lateFeeAlertThreshold`, an `adminAlert` is created and a notification sent to the assigned therapist.

---

## Section 14. The VAT Model

All fees are defined and displayed as the total amount due. VAT is never added on top.

VAT calculation: `vatAmountPence = Math.round(totalPence - (totalPence / (1 + vatRate)))`.

`practice.vatSettings.isVatRegistered` enables VAT practice-wide. `appointmentType.isVatApplicable` overrides per type, defaulting to the practice setting.

---

## Section 15. The Group and Couples Billing Model

`appointment.clientIds` is an array. Each client billed individually per their own billing arrangement. Three scenarios: each billed separately, one billed for both via billing contact, third party billed for all.

Room `capacity` determines maximum group session attendees.

---

## Section 16. The Agreement Model

Single active template per practice. Sections filtered by `appliesTo` scope per client type. Content hash computed at rendering.

Agreement tokens expire after 72 hours. Single use. Consumed on page load.

Scroll-to-sign: accept checkbox hidden until scrolled to bottom. Accept button disabled until checkbox ticked.

Template history preserved via `supersededAt` and `supersededBy`.

---

## Section 17. The Waiting List

When no slots are available, public booking form offers waiting list. Admin has full visibility: contact, convert to client, remove. Waiting list alerts generated when relevant slots appear. No automated matching or notification in v1.

---

## Section 18. The Quick Exit Model

Client and RP portals only. Locked feature.

FAB: fixed bottom right, `var(--fab-size)`, `z-index: var(--z-toast)`. On click: `window.location.replace(url)`. `aria-label`: "Quick exit — leaves this page immediately."

Practice configures: `quickExitDefaultUrl`. Client configures: `quickExitEnabled` (default true), `quickExitUrl` (optional override).

When `quickExitEnabled` is false, the FAB does not render.

---

## Section 19. The Notification and Batch Model

Notifications: per-user, per-role, polled every 60 seconds.

**Production scheduled batches (Firebase Scheduled Cloud Functions):**
- Morning 08:00: scheduling engine, practice note reminders, 24-hour appointment reminders, retention sweep.
- Evening 17:00: overdue invoice checks, next-day appointment reminders, waiting list alerts.

Invoice reminders follow `practice.maxInvoiceReminders` and `practice.invoiceReminderIntervalDays`, with per-client overrides when `client.invoiceReminderOverride` is true.

---

## Section 20. The Audit and Retention Model

Every write action logged to `auditLog`. Append-only. Never edited. Never deleted.

Retention: 7 years after archive by default. For minors: longer of 7 years after archive or until age 25 plus 7 years.

Data export formats: JSON, Markdown, PDF, CSV. Admin exports any client. Client exports own non-clinical data. RP exports linked client's non-clinical data only.

---

## Section 21. Confirmed Decisions Register

All decisions confirmed during planning. This register is the authoritative record. Any decision not listed here has not been confirmed.

D001 through D040 as per Scope Report v1.0, plus:

**D041.** No passwords. Magic link and Google SSO only for all roles.
**D042.** PIN available to Client and RP roles. Session protection layer, not authentication.
**D043.** PIN lock requires admin or therapist unlock. No automated recovery.
**D044.** Three failed PIN attempts locks account. `pinLocked: boolean` on user record.
**D045.** PIN prompt has "Do not show again" toggle. `pinPromptDismissed: boolean`.
**D046.** Discreet comms two-layer model confirmed. Email neutralisation and portal display neutralisation.
**D047.** Role status is per-role not global. `status: { admin, therapist, client, responsiblePerson }`.
**D048.** Onboarding flag is per-role. `onboarding: { admin, therapist, client, responsiblePerson }`.
**D049.** Firebase Auth account persists on deactivation. Active status enforced at Firestore middleware layer.
**D050.** Role selection screen appears only when automatic determination fails. Last state is used as automatic bypass when valid.
**D051.** Admin role always defaults to admin view regardless of last state.
**D052.** Staff shell shared by admin and therapist. Non-staff shell shared by client and RP.
**D053.** Role switcher shows active roles only. Inactive and archived roles never appear.
**D054.** Context switcher in RP view only. Switches between linked clients.
**D055.** Practice Setup route returns hard 404 after completion. No in-app emergency recovery path.
**D056.** Email changes by admin only in v1. Updates both Firebase Auth and Firestore atomically.
**D057.** Magic link invitation expires after 72 hours. Admin resend option available after expiry.
**D058.** Connected from day one. Real Firebase, real Firestore, real auth in every build layer. No localStorage abstraction.
**D059.** Vertical modular build. One complete feature at a time from type definition to tested UI. Nothing declared complete until a real user can test it end to end.

**D060.** One responsible person per client. One RP per client enforced at service layer. Two permission flags: `canManageAppointments` and `canManageInvoices`, both default true. Admin sets per RP record. Service layer checks before allowing RP portal write operations.

---

## Section 22. What This Build Is Forbidden From Including

- Native browser `alert()` or `confirm()` dialogs.
- Self-registration of any kind. No sign-up links. No create account paths.
- Magic link recovery for PIN-locked accounts.
- Any route that bypasses the Firestore active status check.
- Clinical fields returned by any portal-facing service function.
- Direct Firestore imports outside designated service files.
- Financial values as floats. Integers in pence only.
- Hardcoded visual values in component files.
- Features not confirmed in the Decisions Register or this Blueprint.

---

*MTN Therapy Practice Portal | Master Blueprint | v4.0 | 17 May 2026*
*More Than Normal, Canterbury.*
*This document supersedes all previous Blueprint versions.*
*Updated only via formal decision confirmed by Alex Harvey.*
