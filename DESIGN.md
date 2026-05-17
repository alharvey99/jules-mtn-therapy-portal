# DESIGN.md

version: 4.0
updated: 2026-05-17
project: MTN Therapy Practice Portal

---

## meta

role: source-of-truth
owner: More Than Normal
status: current

summary:
  Design contract for the MTN Therapy Practice Portal.
  Defines tokens, theme modes, container hierarchy, shell recipes,
  component conventions, and product-specific safety and accessibility
  requirements so UI decisions stay consistent across dashboard,
  portal, onboarding, public, and auth flows.

usage:
  - Keep this file in sync with globals.css and tailwind.config.ts.
  - Treat this as the single source of truth for all visual decisions.
  - Use this file to brief AI design and dev tools.
  - Do not hardcode colours, spacing, radii, shadows, or typography in components.
  - Update this file first when visual system decisions change.
  - Then sync globals.css and tailwind.config.ts.
  - If a new reusable shell or component pattern is added, register it here.

---

## design-intent

product-principles:
  - calm
  - clear
  - modern
  - low-friction
  - trustworthy
  - accessible
  - emotionally steady

product-notes:
  - This product serves therapy practices and may be used by vulnerable clients.
  - The UI must feel safe, composed, and predictable at all times.
  - Clients may be in distress when using the portal. The interface must not add to that.
  - Error states must feel calm and actionable, not alarming or accusatory.
  - The product must look professional without feeling cold, clinical, or intimidating.
  - Admin and therapist views must feel operationally clear without feeling harsh.
  - Quick Exit must always be visible, immediately reachable, and not visually buried.

avoid:
  - loud gradients or decorative colour usage
  - heavy or multi-layered shadows
  - cramped layouts, especially on form-heavy screens
  - overly dark admin chrome in light mode
  - aggressive status colours used as decoration
  - ambiguous layouts with weak visual hierarchy
  - animations that feel urgent or alarming
  - copy that labels users by their condition or situation

---

## themes

modes:
  - light
  - dark

default-mode: light

mode-principles:
  light:
    description: "Default mode. Soft, bright, clean, and calm. Feels safe and easy to read."
  dark:
    description: "First-class alternate mode. Low-glare, readable, and muted. Not neon or high-contrast styled."

rules:
  - Both modes must be designed intentionally, not created by inversion.
  - Both modes must preserve the same semantic token names.
  - Components must consume semantic tokens only, never raw palette values.
  - Theme switching must not require component-level style rewrites.
  - Dark mode is a genuine user choice, not a developer afterthought.

---

## tokens

### color

palette:
  blue:
    50: "#f2f7ff"
    100: "#dfeeff"
    200: "#bfdcff"
    500: "#4f83cc"
    600: "#3f6fb5"
    700: "#325792"
    900: "#1f2f47"
  slate:
    50: "#f7f9fb"
    100: "#edf2f7"
    200: "#d9e2ec"
    300: "#bcc9d6"
    500: "#6b7c93"
    700: "#425466"
    900: "#1f2933"
  neutral:
    0: "#ffffff"
    25: "#fcfdff"
    50: "#f8fafc"
    100: "#f1f5f9"
    200: "#e2e8f0"
    800: "#1e293b"
    900: "#0f172a"
    950: "#0b1220"
  success:
    100: "#dcfce7"
    500: "#16a34a"
    700: "#15803d"
  warning:
    100: "#fef3c7"
    500: "#d97706"
    700: "#b45309"
  danger:
    100: "#fee2e2"
    500: "#dc2626"
    700: "#b91c1c"
  info:
    100: "#dbeafe"
    500: "#2563eb"
    700: "#1d4ed8"

semantic:
  light:
    canvas:
      bg: neutral.50
      text: neutral.900
      text-muted: slate.700

    panel:
      bg: neutral.0
      bg-muted: neutral.25
      border: neutral.200
      border-strong: slate.300
      text: neutral.900
      text-muted: slate.700

    contrast:
      bg: slate.100
      bg-muted: slate.200
      border: slate.300
      border-strong: slate.500
      text: neutral.900
      text-muted: slate.700

    action:
      primary-bg: blue.600
      primary-bg-hover: blue.700
      primary-text: neutral.0
      secondary-bg: neutral.0
      secondary-border: neutral.200
      secondary-text: neutral.900
      ghost-text: slate.700

    state:
      success-bg: success.100
      success-text: success.700
      warning-bg: warning.100
      warning-text: warning.700
      danger-bg: danger.100
      danger-text: danger.700
      info-bg: info.100
      info-text: info.700

    utility:
      focus-ring: blue.500
      overlay: "rgba(15, 23, 42, 0.48)"
      shadow-colour: "rgba(15, 23, 42, 0.08)"

  dark:
    canvas:
      bg: neutral.950
      text: neutral.50
      text-muted: neutral.200

    panel:
      bg: neutral.900
      bg-muted: neutral.800
      border: slate.700
      border-strong: slate.500
      text: neutral.50
      text-muted: neutral.200

    contrast:
      bg: "#1a2433"
      bg-muted: "#243244"
      border: slate.500
      border-strong: slate.300
      text: neutral.0
      text-muted: neutral.200

    action:
      primary-bg: blue.500
      primary-bg-hover: blue.600
      primary-text: neutral.0
      secondary-bg: neutral.900
      secondary-border: slate.700
      secondary-text: neutral.50
      ghost-text: neutral.200

    state:
      success-bg: "rgba(22, 163, 74, 0.18)"
      success-text: "#86efac"
      warning-bg: "rgba(217, 119, 6, 0.18)"
      warning-text: "#fcd34d"
      danger-bg: "rgba(220, 38, 38, 0.18)"
      danger-text: "#fca5a5"
      info-bg: "rgba(37, 99, 235, 0.18)"
      info-text: "#93c5fd"

    utility:
      focus-ring: blue.500
      overlay: "rgba(2, 6, 23, 0.64)"
      shadow-colour: "rgba(2, 6, 23, 0.32)"

notes:
  - Semantic tokens are the only tokens components should consume.
  - Palette values are referenced here for documentation only.
  - Tenant branding may override palette values, but must not rename semantic roles.
  - canvas, panel, and contrast are container hierarchy levels, not layout elements.
  - contrast does not mean accessibility contrast ratio. It means the strongest non-destructive container layer.
  - dark mode state colours use alpha-channel backgrounds rather than flat tints to avoid harsh blocks of colour.

contrast-pairs:
  - name: body-on-canvas-light
    fg: semantic.light.canvas.text
    bg: semantic.light.canvas.bg
    wcag: AA
  - name: body-on-panel-light
    fg: semantic.light.panel.text
    bg: semantic.light.panel.bg
    wcag: AA
  - name: body-on-canvas-dark
    fg: semantic.dark.canvas.text
    bg: semantic.dark.canvas.bg
    wcag: AA
  - name: body-on-panel-dark
    fg: semantic.dark.panel.text
    bg: semantic.dark.panel.bg
    wcag: AA

---

### radius

scale:
  none: 0px
  sm: 6px
  md: 10px
  lg: 14px
  xl: 18px
  pill: 9999px

usage:
  button: md
  input: md
  card: lg
  modal: lg
  badge: pill
  fab: pill

notes:
  - Roundedness should feel soft and modern, not playful.
  - The FAB (Quick Exit button) uses pill radius.
  - Do not hardcode border-radius in component files.

---

### spacing

scale:
  0: 0px
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px

usage:
  page-padding-x: 6
  page-padding-y: 8
  section-gap: 10
  card-gap: 5
  form-row-gap: 4
  form-section-gap: 6

layout-dimensions:
  header-height: 64px
  drawer-width: 280px
  content-max-width: 1280px
  form-max-width: 640px
  portal-content-max-width: 860px
  fab-size: 48px
  fab-offset: 24px

notes:
  - Prefer generous vertical spacing throughout.
  - Form-heavy screens must breathe. Do not compress form sections.
  - Dense data views (tables, lists) may step down spacing carefully, but must not feel cramped.
  - The portal shell uses portal-content-max-width, not content-max-width. Portal views are narrower by design.
  - The FAB is always positioned fab-offset from the bottom and right edges of the viewport.

---

### typography

families:
  heading: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  body: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace"

font-loading:
  method: next/font/google
  variable: --font-inter
  subsets:
    - latin
  display: swap

scale:
  xs: 12px
  sm: 14px
  base: 16px
  md: 18px
  lg: 20px
  xl: 24px
  2xl: 30px
  3xl: 36px

weights:
  regular: 400
  medium: 500
  semibold: 600
  bold: 700

usage:
  heading-1:
    family: heading
    size: 3xl
    weight: semibold
    line-height: 1.2
  heading-2:
    family: heading
    size: 2xl
    weight: semibold
    line-height: 1.25
  heading-3:
    family: heading
    size: xl
    weight: semibold
    line-height: 1.3
  body-main:
    family: body
    size: base
    weight: regular
    line-height: 1.55
  body-small:
    family: body
    size: sm
    weight: regular
    line-height: 1.45
  label:
    family: body
    size: sm
    weight: medium
    line-height: 1.4
  caption:
    family: body
    size: xs
    weight: regular
    line-height: 1.4
  mono:
    family: mono
    size: sm
    weight: regular
    line-height: 1.5

notes:
  - Use sentence case in all UI labels and headings unless legal wording requires otherwise.
  - Typography should feel plain, steady, and readable.
  - Avoid oversized headings in dashboard and data-heavy contexts.
  - Do not use bold weight as decoration.
  - Mono is used only for code, tokens, IDs, and reference numbers.

---

### shadow

scale:
  none: "none"
  sm: "0 1px 2px 0 var(--shadow-colour)"
  md: "0 4px 12px 0 var(--shadow-colour)"
  lg: "0 12px 24px 0 var(--shadow-colour)"

usage:
  card: sm
  modal: lg
  dropdown: md
  sticky-panel: md
  fab: md

notes:
  - Use shadows sparingly.
  - Prefer borders and container layer contrast before reaching for stronger elevation.
  - Do not stack multiple shadow levels on the same element.
  - The shadow colour token is mode-aware. No hardcoded shadow colours.

---

### motion

easing:
  standard: "cubic-bezier(0.16, 1, 0.3, 1)"

duration:
  fast: 120ms
  normal: 180ms
  slow: 240ms

rules:
  - Use motion for drawers, modals, menus, and lightweight feedback only.
  - Do not use decorative motion.
  - Form submission feedback must be quick and calm. Not celebratory.
  - All motion must respect prefers-reduced-motion. Wrap animated elements in a motion-safe check.
  - The Quick Exit action must be instantaneous. No animation delay on exit.

---

### z-index

scale:
  base: 0
  raised: 10
  overlay: 20
  modal: 30
  popover: 40
  toast: 50
  fab: 50
  dev: 100

notes:
  - The FAB shares the toast z-index level. It must always be visible above page content.
  - Dev toolbar uses the highest z-index and is hidden in production builds.
  - Modals and drawers use the modal level.

---

## container-model

levels:
  canvas:
    purpose: "The main app field or page background."
    examples:
      - page background
      - dashboard main area
      - public page body
      - portal shell background

  panel:
    purpose: "A contained region within the canvas."
    examples:
      - cards
      - toolbars
      - grouped form sections
      - side drawers
      - data panels
      - sub-navigation blocks

  contrast:
    purpose: "A stronger contained region used when clearer separation is needed."
    examples:
      - navigation rail
      - summary pane
      - inspector column
      - sticky action section
      - highlighted operational area

rules:
  - Not every screen needs all three levels.
  - A layout may use multiple panels and no contrast regions.
  - A three-pane layout may use canvas plus panel plus contrast, or canvas plus multiple panels only.
  - Choose the lowest layer that gives enough separation.
  - Do not use contrast as decoration.

---

## layout

shells:
  public:
    description: "Unauthenticated public flow shell for booking, waiting list, and lightweight marketing content."
    regions:
      - header
      - main
      - footer
    defaults:
      container-levels:
        page: canvas
        cards: panel
      behaviour:
        header: simple, light, and minimal
        nav: compact on desktop, drawer on mobile
        crisis-box: must be explicitly included by any page containing therapy-related forms

  auth:
    description: "Centred, narrow shell for login, activation, reset-password, and onboarding steps."
    regions:
      - main
    defaults:
      container-levels:
        page: canvas
        form-card: panel
      behaviour:
        width: max 640px
        alignment: centered
        no-navigation: true
        single-task: true

  dashboard:
    description: "Operational shell for admin and therapist flows."
    regions:
      - nav-region
      - topbar-region
      - main-region
    defaults:
      container-levels:
        page: canvas
        primary-content: panel
        emphasised-region: contrast
      behaviour:
        nav-region: may be rail, drawer, or stacked panel depending on breakpoint and product need
        topbar-region: optional
        main-region: flexible
        mobile-nav: drawer-first
        role-switcher: visible in topbar when user has multiple active staff roles

  portal:
    description: "Client and responsible-person shell with lower cognitive load and calmer emphasis."
    regions:
      - topbar-region
      - main-region
      - support-region
    defaults:
      container-levels:
        page: canvas
        content: panel
        support: contrast
      behaviour:
        navigation: minimal and obvious
        quick-exit-fab: always rendered by this shell. Bottom right. pill radius. fab-size.
        content-width: moderate, not overly wide
        role-switcher: visible in topbar when user has active client and RP roles
        context-switcher: visible in RP view when responsible person has multiple linked clients

  split-view:
    description: "Reusable shell for two-pane or three-pane operational views."
    regions:
      - primary-pane
      - secondary-pane
      - optional-tertiary-pane
    defaults:
      container-levels:
        page: canvas
        primary-pane: panel
        secondary-pane: panel
        optional-tertiary-pane: contrast
      behaviour:
        panes: resizable only if the feature truly needs it
        stacking: collapse to single-column on smaller screens

breakpoints:
  sm: 640px
  md: 768px
  lg: 1024px
  xl: 1280px

rules:
  - Every page must use a named shell or a project-approved shell extension.
  - Shells define arrangement and behaviour, not bespoke colour choices.
  - If a new shell type is introduced and reused, add it here.
  - The portal shell always renders the Quick Exit FAB. This cannot be disabled at the shell level.

---

## components

buttons:
  variants:
    primary:
      bg: action.primary-bg
      bg-hover: action.primary-bg-hover
      text: action.primary-text
      radius: button
    secondary:
      bg: action.secondary-bg
      border: action.secondary-border
      text: action.secondary-text
      radius: button
    ghost:
      bg: transparent
      text: action.ghost-text
      radius: button
    danger:
      bg: state.danger-text
      text: neutral.0
      radius: button

  sizes:
    sm:
      font: body-small
      padding-x: 3
      padding-y: 2
    md:
      font: body-main
      padding-x: 4
      padding-y: 2
    lg:
      font: body-main
      padding-x: 5
      padding-y: 3
    icon:
      dimensions: 40px
      padding: 0
      radius: md

  rules:
    - Primary buttons should be used sparingly.
    - One clear primary action per area where possible.
    - Avoid rows of equally styled primary buttons.
    - Danger variant is reserved for genuinely destructive or irreversible actions only.
    - Loading state: button is disabled and shows a spinner. Label changes to a present-tense verb.

inputs:
  variants:
    default:
      bg: panel.bg
      border: panel.border
      text: panel.text
      radius: input
    contrast:
      bg: contrast.bg
      border: contrast.border
      text: contrast.text
      radius: input

  states:
    focus:
      ring: utility.focus-ring
      ring-width: 3px
      ring-offset: 0
    error:
      border: state.danger-text
      ring: "rgba(220, 38, 38, 0.2)"
    disabled:
      opacity: 0.6
      cursor: not-allowed

  rules:
    - Inputs must feel stable and easy to scan.
    - Form sections should be grouped visually, not only by headings.
    - Every input must have an associated label. No placeholder-only labelling.
    - Every error must be linked to its field via aria-describedby.

cards:
  variants:
    panel-card:
      bg: panel.bg
      border: panel.border
      shadow: sm
      radius: card
    contrast-card:
      bg: contrast.bg
      border: contrast.border
      shadow: none
      radius: card

  rules:
    - Cards group related content or actions. Not decorative containers.
    - Do not nest cards more than one level deep.

alerts:
  kinds:
    info:
      bg: state.info-bg
      text: state.info-text
      border: state.info-text at 0.3 opacity
    success:
      bg: state.success-bg
      text: state.success-text
      border: state.success-text at 0.3 opacity
    warning:
      bg: state.warning-bg
      text: state.warning-text
      border: state.warning-text at 0.3 opacity
    error:
      bg: state.danger-bg
      text: state.danger-text
      border: state.danger-text at 0.3 opacity

  crisis-box:
    description: >
      A specialised info-style alert containing crisis support contact numbers.
      Rendered explicitly by pages containing therapy-related forms.
      Never rendered automatically by any shell.
    content: Samaritans 116 123, NHS 111 option 2, 999 for immediate danger.
    style: info kind with left accent border
    rules:
      - CrisisBox is never rendered by PublicShell or any shell automatically.
      - Any public page presenting a therapy-related form must include CrisisBox.
      - Do not modify the CrisisBox content without clinical review.

badges:
  usage:
    - client status labels (enquiry, active, paused, archived)
    - onboarding stage labels
    - appointment status (confirmed, attended, cancelled, no-show)
    - invoice status (draft, sent, paid, overdue, void)
    - leave status (pending, approved, rejected)
    - alert severity (info, warning, critical)
  rules:
    - Badges are inert. pointer-events none. Never change appearance on hover.
    - Badges must support text and optional leading icon.
    - Colour is never the sole carrier of meaning. Always pair colour with a text label.
    - Do not use badges as decorative elements or for non-status purposes.

tables-and-data:
  rules:
    - Dense data views must remain readable at a glance.
    - Use quiet row styling and strong column headers.
    - Prefer inline summary plus drill-in detail over overwhelming single-screen density.
    - Empty states must be explicit. Never show a blank table.
    - Loading states must use skeleton rows, not a spinner overlaid on stale content.

quick-exit-fab:
  description: >
    A floating action button that immediately navigates the user away from the portal.
    Designed to protect vulnerable clients from abusive persons who may observe their screen.
  position: fixed, bottom-right, fab-offset from each edge
  size: fab-size
  z-index: fab
  radius: pill
  aria-label: "Quick exit — leaves this page immediately"
  action: window.location.replace(url) — replaces history entry, cannot be back-navigated
  visibility: rendered by PortalShell when quickExitEnabled is true on the user record
  rules:
    - Must be reachable by keyboard. Tab order places it last.
    - Must be immediately obvious without requiring the user to scroll.
    - Must not be visually buried, overlapped, or obscured by other fixed elements.
    - The action must be instantaneous. No confirmation dialog. No animation delay.

role-switcher:
  description: >
    A compact control in the topbar that allows users with multiple active roles
    to switch their current portal context.
  visibility:
    staff-shell: shown when user has both admin and therapist roles active
    portal-shell: shown when user has both client and responsible-person roles active
  rules:
    - Shows only roles where status is active. Archived or inactive roles never appear.
    - Switching role navigates to the dashboard of the selected role.
    - Last role state is preserved between sessions for all roles except admin.
    - Admin always defaults to admin view regardless of last state.

context-switcher:
  description: >
    A compact control in the portal shell that allows a responsible person
    to switch between their linked clients.
  visibility: shown in portal-shell when current role is responsible-person and user has more than one linked client
  rules:
    - Each switch loads the portal view scoped to the selected client.
    - The currently selected client is always clearly labelled.

pin-entry:
  description: >
    A post-authentication screen that appears when a client or responsible person
    has set a PIN. Protects the session from access by persons who have the user's email.
  behaviour:
    - Shown after Firebase Auth succeeds, before the portal loads.
    - Three failed attempts locks the account (pinLocked: true).
    - Locked state terminates the session and shows a calm unlock message.
    - No automated recovery. Admin or therapist must unlock.
    - PIN entry field should be numeric. Four to six digits.
    - Do not show a forgot PIN link.
  copy:
    locked: "Your account has been locked. Please contact your practice to unlock it."

onboarding-stage-indicator:
  description: >
    A horizontal progress indicator showing all ten onboarding stages.
    Used on client records and in the onboarding pipeline view.
  stages: 10
  style:
    complete: filled, success colour
    current: filled, primary colour, labelled
    pending: outlined, muted colour
  rules:
    - Always show all ten stages. Never truncate.
    - Stage labels use plain language, not technical field names.

---

## interaction

states:
  - hover
  - focus
  - active
  - disabled
  - loading
  - error
  - success

rules:
  - All interactive elements must have visible focus states using the focus-ring token.
  - Icon-only controls require an accessible aria-label.
  - Actions that affect money, permissions, scheduling, or irreversible changes must be clearly labelled.
  - Destructive actions must be guarded with a ConfirmDialog (shadcn AlertDialog). No native browser dialogs.
  - Sensitive actions (archive, void, write-off, PIN unlock) must show what will happen before the user confirms.

feedback:
  loading:
    style: "Quiet and clear. Spinner or skeleton. Never a full-page block."
  success:
    style: "Short and reassuring. Route to notification bell for routine CRUD confirmations."
  error:
    style: "Calm and actionable. Tell the user what happened and what to do next."
  empty:
    style: "Explicit and helpful. Always explain why the view is empty and what to do."

notification-routing:
  rule: >
    Routine CRUD success confirmations (saved, updated, created) do not use
    toast notifications or screen-blocking messages. They route to the notification bell.
    Only errors, destructive confirmations, and time-sensitive alerts surface as inline alerts
    or blocking dialogs.

---

## accessibility

requirements:
  - All text must meet WCAG 2.1 AA contrast ratio or better in both light and dark modes.
  - All forms must have labels associated via htmlFor and id.
  - All errors must be connected to their field via aria-describedby.
  - All major flows must be keyboard navigable.
  - Colour is never the sole carrier of meaning. Always pair with text or icon.
  - Reduced motion must be respected. Use prefers-reduced-motion media query.
  - Quick Exit must be reachable by keyboard at all times.
  - One h1 per page. Heading hierarchy must be logical and sequential.

patterns:
  focus-management:
    - On opening a modal or drawer, move focus to the heading or first meaningful control.
    - On closing a modal or drawer, return focus to the trigger element.
    - Do not trap focus outside of modals and drawers.
  error-messaging:
    - Put a useful summary above complex multi-field forms.
    - Pair field-level errors with specific next-step guidance.
    - Never use red alone to indicate an error. Always pair with text and icon.
  safety-specific:
    - The Quick Exit action must be visible, immediate, and not visually buried.
    - Safety-related messaging (PIN lock, safety wizard) must be plain, calm, and non-alarming.
    - Do not use language that labels users by their mental health status or situation.
    - Error messages on auth and onboarding flows must not reveal whether an email is registered.

---

## tone-and-feel

keywords:
  - calm
  - precise
  - unfussy
  - modern
  - safe
  - human
  - trustworthy

copy-style:
  - Plain UK English throughout.
  - Short, direct sentences. No jargon.
  - Labels use sentence case, not title case.
  - Error messages explain what happened and what to do next.
  - Avoid language that implies blame or failure. "Something went wrong" not "You entered an invalid value."
  - Avoid clinical terminology in client-facing copy. "Your sessions" not "Your appointments (therapy)."
  - Confirmation dialogs explain the consequence, not just the action.

ui-character:
  - Light mode should feel soft, airy, and steady. Not stark or clinical.
  - Dark mode should feel muted, focused, and low-glare. Not dramatic.
  - The interface should feel trustworthy before it feels clever.
  - Admin and therapist views may be denser and more operational. They must still feel calm.
  - Client and RP views must prioritise clarity and low cognitive load above operational density.

---

## implementation-notes

tech:
  framework: Next.js App Router
  styling: Tailwind CSS with CSS custom properties as design tokens
  ui-library: shadcn/ui with Custom preset (no preset theme)
  fonts: Inter via next/font/google

mapping:
  - Implement all semantic tokens as CSS custom properties in globals.css.
  - Bridge tokens into Tailwind via tailwind.config.ts theme extension.
  - Components consume semantic tokens only. Never raw palette values.
  - Shell components map regions to container levels. They must not invent local colour decisions.
  - Dark mode is applied via the .dark class on the html element, managed by a theme provider.

shadcn-usage:
  - shadcn/ui components are copied into src/components/ui/ and owned by the project.
  - Do not modify shadcn primitives directly. Wrap them in project-specific components.
  - shadcn default token names (--primary, --secondary, etc) are replaced by MTN semantic tokens.

change-process:
  - Update this file first when any visual system decision changes.
  - Then update globals.css and tailwind.config.ts to match.
  - If a new reusable shell or component pattern appears, register it here.
  - Keep this file and the implementation in sync at all times.
  - Version this file with each significant change.

---

## changelog

### v4.0 — 2026-05-17
Full rewrite as consolidated therapy portal design document.
Incorporates both the therapy-portal-specific DESIGN.md (v0.1) and the MTN App Starter DESIGN.md (v0.1).
Adds: z-index scale, layout dimensions, portal-specific rules, fab specification,
role-switcher and context-switcher component contracts, pin-entry component contract,
onboarding-stage-indicator contract, crisis-box specification, dark mode state token rationale,
notification-routing rule, safety-specific accessibility patterns, and full implementation notes.
Removes: references to localStorage, dev toolbar as core feature (retained in implementation as dev-only).

### v0.1 — 2026-05-15
Initial project-specific design contract created.
