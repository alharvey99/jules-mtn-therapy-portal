# QA Test Sheet: Phase 1 Module 2

**Module:** Admin Settings and Practice Configuration
**Phase:** 1 (App-Wide Demo - UI Only)
**Date:** [Insert Date]
**Tester:** [Insert Name]

---

## 1. Admin Onboarding Flow (`/admin/welcome`)

**Prerequisites:** Navigate to `http://localhost:3000/admin/welcome`

| ID | Test Case | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| ONB-01 | **Initial Render** | Step 1 (Practice Details) is displayed. The progress indicator shows 1 of 3. | | |
| ONB-02 | **Step 1: Form Elements** | "Practice Name" and "Address" fields are visible and accept input. Default values are pre-filled. | | |
| ONB-03 | **Step Navigation (Forward)** | Clicking "Continue" or "Skip" navigates to Step 2. Progress indicator updates to 2 of 3. | | |
| ONB-04 | **Step Navigation (Back)** | Clicking "Back" returns to Step 1. | | |
| ONB-05 | **Step 2: Branding** | "Primary Colour" and "Logo URL" fields are visible. "Skip" button is present. | | |
| ONB-06 | **Step 3: Policy Defaults** | "Cancellation Notice" and "Buffer Time" fields are visible. | | |
| ONB-07 | **Completion** | Clicking "Complete Setup" redirects the user to `/admin/settings`. | | |

---

## 2. Settings Page (`/admin/settings`)

**Prerequisites:** Navigate to `http://localhost:3000/admin/settings`

### 2.1 General & Tabs Navigation
| ID | Test Case | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| SET-01 | **Initial Render** | Page renders correctly. "Practice Details" tab is selected by default. | | |
| SET-02 | **Tab Switching** | Clicking through Practice Details, Policies, Appointment Types, Rooms, and Branding switches the active view without reloading the page. | | |

### 2.2 Practice Details, Policies & Branding
| ID | Test Case | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| PRAC-01 | **Practice Details Fields** | Name, Address, Email, and Phone fields exist and are populated with demo data. "Save Changes" button is visible. | | |
| POL-01 | **Policies Fields** | Cancellation Notice and Buffer Time fields exist and are populated. "Save Changes" button is visible. | | |
| BRN-01 | **Branding Fields** | Primary Colour and Logo URL fields exist and are populated. "Save Changes" button is visible. | | |

### 2.3 Appointment Types
| ID | Test Case | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| APT-01 | **Default Data** | Two defaults are shown: "Initial Assessment" and "Individual Therapy Session". | | |
| APT-02 | **Create Flow (Open)** | Clicking "Create New" opens a modal dialog with Name, Duration, and Fee fields. | | |
| APT-03 | **Create Flow (Save)** | Filling out the form and clicking "Save" adds the new type to the list and closes the dialog. | | |
| APT-04 | **Edit Flow (Open)** | Clicking "Edit" on an existing type opens the dialog pre-filled with that type's data. | | |
| APT-05 | **Edit Flow (Save)** | Changing a value (e.g., fee) and saving correctly updates the list row without creating a duplicate. | | |
| APT-06 | **Archive Flow** | Clicking "Archive" on an appointment type removes it from the list immediately. | | |

### 2.4 Rooms
| ID | Test Case | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| ROM-01 | **Default Data** | Shows demo active rooms (e.g., Room 1, Room 2). | | |
| ROM-02 | **Create Flow (Open)** | Clicking "Add Room" opens a modal dialog for Room Name. | | |
| ROM-03 | **Create Flow (Save)** | Submitting the form adds the room to the list and sets its status to "Active". | | |
| ROM-04 | **Edit Flow** | Clicking "Edit" opens the dialog, and saving updates the room name in the list. | | |
| ROM-05 | **Deactivate Flow** | Clicking "Deactivate" removes the room from the active list immediately. | | |

---

## 3. UI/UX Verification (Global)

| ID | Test Case | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| UX-01 | **Responsive Layout** | Onboarding and Settings pages render correctly on smaller screen sizes (e.g., mobile view). No horizontal scrolling required. | | |
| UX-02 | **Semantic Tokens** | No hardcoded colors. Elements use `bg-panel-bg`, `text-panel-text`, etc. Verified via source code or dev tools. | | |
| UX-03 | **Input Types** | Fee and Duration inputs correctly use `type="number"`. Email uses `type="email"`. | | |

---

## Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| QA Tester | | | |
| Engineering Lead | | | |
| Product Owner | | | |
