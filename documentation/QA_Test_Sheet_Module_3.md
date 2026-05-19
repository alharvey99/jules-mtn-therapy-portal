# QA Test Sheet: Phase 1 Module 3

**Module:** Therapist Management
**Phase:** 1 (App-Wide Demo - UI Only)
**Date:** [Insert Date]
**Tester:** [Insert Name]

---

## 1. Admin: Therapist List & Invite (`/admin/therapists`)

**Prerequisites:** Navigate to `http://localhost:3000/admin/therapists`

| ID | Test Case | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| LST-01 | **Initial Render** | The list of therapists is displayed, showing Name, Email, Status, and Active Clients. | | |
| LST-02 | **Status Badges** | Ensure status badges are correctly styled (e.g., Active is green/success, Invited is yellow/warning). | | |
| INV-01 | **Invite Form (Open)** | Clicking "Invite Therapist" opens a modal dialog. | | |
| INV-02 | **Invite Form (Fields)** | "Full Name" and "Email Address" fields are present and required. | | |
| INV-03 | **Invite Form (Submit)** | Submitting the form adds the new therapist to the list with the status "Invited" and closes the dialog. | | |
| ARC-01 | **Archive Dialog (Open)** | Clicking "Archive" via the 3-dots dropdown opens a confirmation `AlertDialog`. | | |
| ARC-02 | **Archive Dialog (Warning)** | The dialog displays the name of the therapist and a warning about their active clients. | | |
| ARC-03 | **Archive Dialog (Submit)** | Clicking "Archive" (danger button) removes the therapist from the list. | | |

---

## 2. Admin: Therapist Detail View (`/admin/therapists/1`)

**Prerequisites:** Navigate to `http://localhost:3000/admin/therapists/1`

| ID | Test Case | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| DTL-01 | **Initial Render** | The profile details page is loaded correctly with "Profile & Specialisms" tab active. | | |
| DTL-02 | **Profile Management** | Biography, Qualifications, and Specialisms fields are populated and editable. | | |
| DTL-03 | **Working Hours Tab** | Working hours editor is displayed. Checkboxes for days (Mon-Fri) and time inputs are available and pre-populated. | | |
| DTL-04 | **Leave Approval Tab** | Leave requests table is displayed, containing Pending and Approved leave records. | | |
| DTL-05 | **Leave Actions** | Pending leave records show "Approve" and "Reject" buttons. | | |

---

## 3. Therapist: Onboarding Flow (`/therapist/welcome`)

**Prerequisites:** Navigate to `http://localhost:3000/therapist/welcome`

| ID | Test Case | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| THO-01 | **Initial Render** | Step 1 (Working Hours) is displayed. Progress indicator shows 1 of 2. | | |
| THO-02 | **Step 1: Working Hours** | Checkboxes for Monday-Friday and required TimeInputs (e.g. 09:00 to 17:00) are visible. | | |
| THO-03 | **Step 1: Navigation** | Clicking "Continue" navigates to Step 2. | | |
| THO-04 | **Step 2: Profile** | Biography, Qualifications, and Specialisms fields are visible. | | |
| THO-05 | **Step 2: Skippable** | A "Skip" button is present and functional on Step 2. | | |
| THO-06 | **Completion** | Clicking "Complete Setup" or "Skip" redirects the user to `/therapist/schedule`. | | |

---

## 4. Therapist: Profile & Leave Management (`/therapist/profile`, `/therapist/leave`)

**Prerequisites:** Navigate to `http://localhost:3000/therapist/profile` and `/therapist/leave`

### 4.1 Profile Management
| ID | Test Case | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| TPF-01 | **Professional Profile** | Biography, Qualifications, and Specialisms are pre-populated. "Save Profile" button is present. | | |
| TPF-02 | **Working Hours** | Time inputs and day checkboxes are displayed correctly and match standard styles. | | |

### 4.2 Leave Management
| ID | Test Case | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| TLV-01 | **Leave History** | A table of past and upcoming leave requests is displayed with their respective Statuses. | | |
| TLV-02 | **Request Leave (Open)** | Clicking "Request Leave" opens a modal dialog. | | |
| TLV-03 | **Request Leave (Fields)** | "Leave Type" (Select), "Start Date", "End Date", and optional "Reason" fields are present. | | |
| TLV-04 | **Request Leave (Submit)** | Submitting the form adds the leave request to the table with a "Pending" status. | | |

---

## Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| QA Tester | | | |
| Engineering Lead | | | |
| Product Owner | | | |
