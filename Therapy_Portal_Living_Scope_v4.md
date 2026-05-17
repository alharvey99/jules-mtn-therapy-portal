# MTN Therapy Practice Portal
## Current Scope — Living Document
### Version 1.2 | 17 May 2026
### More Than Normal

---

## Purpose

This is the running state document for the MTN Therapy Practice Portal project. It is the first document read at the start of any session, whether human-led or agentic.

It captures: current build status, open questions requiring decisions, recent decisions not yet absorbed into planning documents, future scope ideas, and session notes.

---

## Build Approach

**Mode:** Agentic
**Developer:** Perplexity Computer
**Testing:** Playwright automated tests with Firebase Emulator. Human review at each module demo stage sign-off and after full build completion.
**Infrastructure target:** GCP / Firebase (live environment for human testing after agentic build)
**Credit model:** Pay-per-use. Efficiency is a hard constraint. Agent must stop and ask rather than loop or speculate.

**Build lifecycle per module:**
1. **Demo stage.** Build all UI with hardcoded demo data. No service calls. Every screen viewable via dev toolbar role switcher. Human reviews and signs off the UI.
2. **Wired stage.** Connect to services, write tests, run verification. Produce module completion report.
3. **Sign-off.** Module accepted. Move to next module.

**Key efficiency rule:** If the agent encounters a problem it cannot resolve within two attempts, or an ambiguity that could go in two meaningfully different directions, it must stop immediately and request clarification. Do not retry speculatively. Do not generate alternative implementations. Stop and ask.

---

## Current Build Status

### Document Set

| Document | Version | Status |
|---|---|---|
| Master Blueprint | v4.0 | Current |
| DESIGN.md | v4.0 | Current |
| Engineering Standards | v5.0 | Current |
| Build Plan | v5.0 | Current |
| Current Scope Living Document | v1.2 | Current |
| Type Definitions | v4.0 | Current |

**Remaining documents to generate:**
- GEMINI.md v5.0 (for future supervised sessions, updated for module lifecycle)
- User Journey and Gap Analysis v2.0 (updated with resolved gaps)

### Build Progress

| Module | Demo Stage | Wired Stage | Status |
|---|---|---|---|
| F1: Project Scaffold | N/A | Not started | Pending |
| F2: Firebase and Middleware | N/A | Not started | Pending |
| F3: Core Component Library | Not started | Not started | Pending |
| M1: Auth and Practice Setup | Not started | Not started | Pending |
| M2: Admin Settings | Not started | Not started | Pending |
| M3: Therapist Management | Not started | Not started | Pending |
| M4: Client Management | Not started | Not started | Pending |
| M5: Onboarding Pipeline | Not started | Not started | Pending |
| M6: Scheduling | Not started | Not started | Pending |
| M7: Invoicing and Billing | Not started | Not started | Pending |
| M8: Client Portal | Not started | Not started | Pending (OQ1 blocks payment) |
| M9: RP Portal | Not started | Not started | Pending (OQ6 blocks write scope) |
| M10: Therapist Portal | Not started | Not started | Pending (OQ5 blocks invoice visibility) |
| M11: Admin Dashboard | Not started | Not started | Pending (OQ4 blocks content model) |
| M12: Waiting List | Not started | Not started | Pending |
| M13: Data Export | Not started | Not started | Pending |

### Note on Previous Progress

Foundation Chunk F.1 was partially started in Firebase Studio under the v4 chunk model (shadcn/ui installed, some tasks pending). The boilerplate work used the localStorage abstraction model. Given the switch to connected-from-day-one and the new module lifecycle, the agentic build will start fresh from Foundation Module F1.

---

## Open Questions

These require a confirmed decision before the relevant build module can begin. The agent must stop and ask when it reaches a blocked module rather than proceeding with assumptions.

| # | Question | Blocks | Priority |
|---|---|---|---|
| OQ1 | Payment provider: Stripe, manual recording, or hybrid? | Module 8 payment action | High |
| OQ2 | Email delivery provider for production tenant deployments? | All invitation emails in production | Medium (emulator covers dev) |
| OQ3 | Agreement signing: Web Crypto content hash only, or third-party e-signature service? | Module 5 agreement detail | High |
| OQ4 | Admin dashboard: exact content, priority ordering, and whether operational metrics are included? | Module 11 | Medium |
| OQ5 | Can a therapist see invoice status or outstanding balance for their own clients? | Module 10 scope | Medium |
| OQ6 | Can a responsible person pay an invoice, book, cancel, or sign on behalf of a linked client? | Module 9 write scope | High |
| OQ7 | What happens to a waiting list entry when the enquirer converts through a different route? | Module 12 service logic | Low |
| OQ8 | PIN: numeric only on all platforms, or biometric-linked on mobile? | PIN implementation | Medium |
| OQ9 | Can admin create a manual invoice not linked to an appointment? | Module 7 scope | Medium |
| OQ10 | Public booking form exact field list. Is date of birth collected here or in extended form? | Public booking feature | Medium |

---

## Decisions Absorbed Into v4/v5 Documents

All decisions D001 through D060 are fully absorbed into Master Blueprint v4.0.

**D061.** UI-first modular build lifecycle. Each module built in two stages: demo (hardcoded data, visual review) then wired (services, tests, verification). Absorbed into Engineering Standards v5.0 and Build Plan v5.0.

**D062.** Modules replace chunks. The Build Plan defines modules as self-contained deliverables. The developer decides how to split internal work. Gates are at demo sign-off and module completion sign-off only. Absorbed into Build Plan v5.0.

**D063.** Demo data in `src/lib/demo/data.ts`. Single file. Typed. Realistic. Covers all visible states. Imports removed during wired stage. Absorbed into Engineering Standards v5.0.

---

## Decisions Made This Session (Not Yet in v5 Documents)

None at time of writing.

---

## Gaps Still Open

### Previously critical — now resolved

| Gap | Resolution |
|---|---|
| Admin and therapist account creation and invitation flow | Resolved: Module 3 |
| Practice first-run setup wizard | Resolved: Module 1 |
| Responsible person invitation and activation | Resolved: Module 4 |

### Currently open — significant

| Gap | Status | Blocked on |
|---|---|---|
| Client invoice payment journey | Open | OQ1 |
| Admin dashboard exact content model | Open | OQ4 |
| RP portal permissions (pay, book, sign?) | Open | OQ6 |

### Currently open — moderate

| Gap | Status |
|---|---|
| Settings change impact on existing data (e.g. changing cancellation window mid-operation) | Not yet specified |
| Audit log viewer UI specification | Low priority for v1 |
| Therapist portal exact scope (invoices visible?) | Open, blocked on OQ5 |

---

## Future Scope Ideas

Out of scope for v1. Do not influence the current build. Log new ideas here.

- Automated waiting list matching when slots become available.
- Secure client-to-practice messaging channel.
- Therapist supervision logging for CPD tracking.
- Standardised outcome measures (PHQ-9, GAD-7) at configurable intervals.
- Dedicated group therapy session management UI.
- Practice analytics dashboard (occupancy, revenue, cancellation rates).
- Native mobile app for client portal with push notifications and biometric Quick Exit.
- Multi-therapist capacity planning and cross-therapist client transfer workflows.
- Accounting software export (Xero, QuickBooks, FreeAgent).
- Automated retention sweep and deletion with admin confirmation flow.
- Admin dashboard role-configurable per admin user.
- Therapist expense submission.
- Multi-language support for client portal.

---

## Agentic Build — Operational Notes

These notes are for the agentic developer (Perplexity Computer) and any human reviewer.

**Before starting:** Read Master Blueprint v4.0, DESIGN v4.0, Engineering Standards v5.0, and Build Plan v5.0 in full. Confirm understanding before writing any code.

**Module lifecycle:**
1. Read the module specification in Build Plan v5.0.
2. Build all UI for the demo stage with hardcoded demo data from `src/lib/demo/data.ts`.
3. Confirm all demo stage acceptance criteria pass.
4. Report demo stage complete. Wait for sign-off if human review is required.
5. Build the wired stage: schemas, services, actions, hooks, tests.
6. Run grep verification commands from Engineering Standards Section 15.
7. Produce the module completion report in the format from Engineering Standards Section 16.

**When blocked:** Stop immediately. Write a clear, specific description of the blocker. Do not attempt a third approach. Do not speculate. Wait for human input.

**When ambiguous:** Stop. Describe the ambiguity and the two possible interpretations. Wait for a decision. Do not pick one and proceed silently.

**Clinical isolation:** The `getClientForPortal` clinical isolation test (Engineering Standards Section 7.6) is mandatory. It must exist and must pass before Module 8 (Client Portal) can be signed off.

**Credits are limited:** Every unnecessary retry, speculative implementation, or loop costs real money. Work efficiently. Stop and ask when uncertain.

---

## Session Notes

### Session: 17 May 2026

**Major decisions this session:**
- Moved from localStorage abstraction to real Firebase from day one (D058).
- Confirmed vertical modular build with agentic developer (Perplexity Computer) (D059).
- Confirmed no passwords ever. Magic link and Google SSO for all roles (D041).
- Confirmed PIN model for client and RP roles (D042-D045).
- Confirmed discreet communications two-layer model (D046).
- Confirmed per-role status and onboarding flag model (D047-D048).
- Confirmed role selection screen appears only on automatic determination failure (D050).
- Confirmed admin always defaults to admin view (D051).
- Confirmed staff shell shared by admin and therapist, portal shell shared by client and RP (D052).
- Confirmed role switcher shows active roles only (D053).
- Confirmed Practice Setup route returns hard 404 after completion (D055).
- Confirmed email changes by admin only in v1 (D056).
- Consolidated from 14 documents to 5 core planning documents plus Types and GEMINI.md.
- Generated Blueprint v4, Engineering Standards v4/v4.1, Build Plan v4/v4.1, DESIGN v4, Type Definitions v4, Living Scope v1/v1.1.
- Confirmed Playwright as automated testing framework.
- Confirmed Firebase Auth Emulator and Firestore Emulator for test isolation.
- Added stop-and-ask efficiency rules for agentic build.
- **Adopted UI-first modular build lifecycle (D061).** Demo stage with static props, then wire, then test, then sign off.
- **Replaced chunk protocol with module protocol (D062).** Developer decides internal work split. Gates at demo sign-off and module completion only.
- **Demo data centralised in `src/lib/demo/data.ts` (D063).**
- Updated Engineering Standards to v5.0 and Build Plan to v5.0.

**Still to generate:**
- GEMINI.md v5.0 (for future supervised sessions with Gemini or similar)
- User Journey and Gap Analysis v2.0

---

## How to Use This Document

**At the start of every session (human or agentic):** Read this document first. Check build status and open questions before doing anything else.

**When a decision is made:** Log it in "Decisions Made This Session" immediately.

**When a gap is resolved:** Update the gaps section.

**When a future idea is raised:** Log it in Future Scope Ideas. Do not discuss further in the current session.

**When a document is updated:** Update the Document Set table.

**This document is always v1.x.** It is never replaced. It is always the current state. The minor version increments when significant changes are made within a session.

---

*MTN Therapy Practice Portal | Current Scope Living Document | v1.2 | 17 May 2026*
*More Than Normal, Canterbury.*
*Updated every session. Always the current state.*
