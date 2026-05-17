// MTN Therapy Practice Portal
// Type Definitions
// Version 4.0 | 17 May 2026
//
// This file is the canonical TypeScript contract for all data entities.
// Copy to src/lib/types.ts.
//
// RULES:
// - Do not modify any interface without explicit instruction from Alex.
// - Do not add fields without explicit instruction.
// - Do not rename fields. Firestore documents use these exact field names.
// - All financial values are integers in pence. No floats. Ever.
// - All timestamps are ISO 8601 strings (toISOString()).
// - All IDs are Firebase document IDs (strings).
//
// CHANGES FROM v3:
// - UserDocument: per-role status object, per-role onboarding object,
//   pinLocked, pinAttempts, pinPromptDismissed, lastRole added.
//   pinHash moved from global to user level.
//   discreetComms moved from ClientDocument to UserDocument (client-controlled in settings).
// - PracticeDocument: practiceSetupComplete, discreetCommsNeutralName added.
// - ClientDocument: discreetComms removed (now on UserDocument).
// - All localStorage and dev context references removed.
// - PortalSafeClient updated to reflect discreetComms move.

// ============================================================
// SECTION 1: UNIVERSAL UTILITY TYPES
// ============================================================

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string> }

export type UserRole =
  | 'admin'
  | 'therapist'
  | 'client'
  | 'responsiblePerson'

export type RoleStatus = 'active' | 'inactive' | 'archived'

export interface PerRoleStatus {
  admin: RoleStatus
  therapist: RoleStatus
  client: RoleStatus
  responsiblePerson: RoleStatus
}

export interface PerRoleOnboarding {
  admin: boolean
  therapist: boolean
  client: boolean
  responsiblePerson: boolean
}

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

// ============================================================
// SECTION 2: SHARED STATUS AND UNION TYPES
// ============================================================

export type ClientType = 'adult' | 'adolescent' | 'adult_managed'

export type ClientStatus = 'enquiry' | 'active' | 'paused' | 'archived'

export type OnboardingStage =
  | 'enquiry_received'
  | 'assessment_booked'
  | 'extended_form_sent'
  | 'extended_form_complete'
  | 'assessment_complete'
  | 'agreement_sent'
  | 'agreement_accepted'
  | 'portal_invite_sent'
  | 'portal_active'
  | 'onboarding_complete'

export type AppointmentStatus =
  | 'confirmed'
  | 'attended'
  | 'late_cancelled'
  | 'cancelled_by_client'
  | 'cancelled_by_practice'
  | 'no_show'
  | 'rescheduled'
  | 'ghost'

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'partially_paid'
  | 'overdue'
  | 'void'
  | 'refunded'

export type LeaveStatus = 'pending' | 'approved' | 'cancelled' | 'rejected'

export type LeaveType = 'annual' | 'sick' | 'personal' | 'training' | 'other'

export type LeaveApprovalPolicy =
  | 'notification_only'
  | 'admin_approved'
  | 'self_managed'

export type AgreementStatus = 'sent' | 'accepted' | 'superseded'

export type TokenType = 'extended_form' | 'agreement' | 'portal_invite'

export type NotificationType =
  | 'appointment_reminder'
  | 'appointment_cancelled'
  | 'invoice_issued'
  | 'invoice_reminder'
  | 'invoice_overdue'
  | 'agreement_sent'
  | 'agreement_signed'
  | 'leave_submitted'
  | 'leave_approved'
  | 'leave_rejected'
  | 'note_reminder'
  | 'late_fee_threshold'
  | 'waiting_list_slot'
  | 'onboarding_action'
  | 'pin_unlocked'
  | 'system'

export type NotificationPriority = 'info' | 'action_required' | 'urgent'

export type AdminAlertType =
  | 'bank_holiday_conflict'
  | 'therapist_conflict'
  | 'room_conflict'
  | 'scheduler_error'
  | 'archive_review_due'
  | 'retention_expiry'
  | 'late_fee_threshold'
  | 'waiting_list_slot_available'
  | 'invoice_reminder_limit_reached'
  | 'pin_locked'

export type AdminAlertSeverity = 'info' | 'warning' | 'critical'

export type NoteCategory =
  | 'general'
  | 'scheduling'
  | 'billing'
  | 'safeguarding_admin'
  | 'accessibility'

export type NotePriority = 'info' | 'attention' | 'urgent'

export type AgreementSectionScope =
  | 'all'
  | 'minors_only'
  | 'couples_only'
  | 'managed_only'

export type CreditTransactionType = 'purchase' | 'application' | 'refund'

export type SessionModality = 'in_person' | 'virtual' | 'phone'

export type WaitingListStatus = 'waiting' | 'contacted' | 'converted' | 'removed'

export type ExportFormat = 'json' | 'markdown' | 'pdf' | 'csv'

// ============================================================
// SECTION 3: SHARED OBJECT SHAPES
// ============================================================

export interface AddressObject {
  line1: string
  line2?: string
  city: string
  county?: string
  postcode: string
  country?: string
}

export interface WorkingHoursObject {
  monday:    WorkingDayObject
  tuesday:   WorkingDayObject
  wednesday: WorkingDayObject
  thursday:  WorkingDayObject
  friday:    WorkingDayObject
  saturday:  WorkingDayObject
  sunday:    WorkingDayObject
}

export interface WorkingDayObject {
  enabled: boolean
  start: string    // HH:mm
  end: string      // HH:mm
}

export interface VatSettingsObject {
  isVatRegistered: boolean
  vatRate: number           // e.g. 0.20 for 20%
  vatNumber?: string
}

export interface NotificationPreferencesObject {
  appointments: boolean
  invoices: boolean
  agreements: boolean
  leave: boolean
  system: boolean
}

export interface PortalVisibilityObject {
  canViewUpcomingAppointments: boolean
  canViewAppointmentHistory: boolean
  canViewInvoices: boolean
  canViewCreditBalance: boolean
  canRequestCancellations: boolean
  canUpdateContactDetails: boolean
}

export interface RecurringScheduleObject {
  frequency: 'weekly' | 'fortnightly'
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
  startTime: string                        // HH:mm
  appointmentTypeId: string
  therapistId: string
  roomId?: string
  activeFrom: string                       // ISO timestamp. Set once. Never changes.
  activeUntil?: string
  pausedFrom?: string
  pausedUntil?: string
}

export interface AgreementSectionObject {
  key: string
  title: string
  content: string
  appliesTo: AgreementSectionScope
  order: number
}

export interface InvoiceLineItemObject {
  description: string
  quantity: number
  unitPricePence: number
  totalPence: number
  isVatApplicable: boolean
}

// ============================================================
// COLLECTION 1: practices
// ============================================================

export interface PracticeDocument {
  id: string
  name: string
  slug: string
  email: string
  phone: string
  address: AddressObject
  website?: string
  timezone: string                      // Default: 'Europe/London'
  cancellationWindowHours: number       // Default: 24
  lateFeeAmountPence: number            // Integer pence
  bufferMinutes: number                 // Default: 10
  publicBookingWindowDays: number       // Default: 14
  lateFeeAlertThreshold: number         // Default: 3
  maxInvoiceReminders: number           // Default: 3
  invoiceReminderIntervalDays: number   // Default: 7
  leaveApprovalPolicy: LeaveApprovalPolicy
  invoicePrefix: string                 // Default: 'INV'
  invoiceStartNumber: number            // Default: 1
  clientRefPrefix: string               // Default: 'CHR'
  quickExitDefaultUrl: string           // Default: 'https://www.bbc.co.uk'
  vatSettings: VatSettingsObject
  retentionYears: number                // Default: 7
  minorRetentionUntilAge: number        // Default: 25
  practiceSetupComplete: boolean        // Set to true after Practice Setup wizard. Never reset.
  discreetCommsNeutralName: string      // Display name used when discreetComms is active. e.g. 'My Portal'
  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 2: users
// ============================================================

export interface UserDocument {
  id: string                            // Same UUID as Firebase Auth UID
  roles: UserRole[]
  status: PerRoleStatus                 // Per-role active/inactive/archived status
  onboarding: PerRoleOnboarding        // Per-role onboarding completion flag
  lastRole?: UserRole                   // Last active role. Used for session default. Admin always overrides.
  firstName: string
  lastName: string
  email: string
  phone?: string
  notificationPreferences: NotificationPreferencesObject

  // PIN model (client and responsiblePerson roles only)
  pinHash?: string                      // bcrypt hash. Never plaintext.
  pinLocked: boolean                    // Default: false. Set to true after 3 failed attempts.
  pinAttempts: number                   // Default: 0. Reset to 0 on successful PIN entry or admin unlock.
  pinPromptDismissed: boolean           // Default: false. Set to true when user dismisses PIN setup prompt.

  // Quick Exit (client and responsiblePerson roles only)
  quickExitEnabled: boolean             // Default: true
  quickExitUrl?: string                 // Optional client-level override. Falls back to practice default.

  // Discreet communications (client role only)
  discreetComms: boolean                // Default: false. Controlled by client in settings.

  // Invoice reminder overrides
  invoiceReminderOverride: boolean      // Default: false
  maxInvoiceReminders?: number          // Only active when invoiceReminderOverride is true
  invoiceReminderIntervalDays?: number  // Only active when invoiceReminderOverride is true

  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 3: therapistProfiles
// ============================================================

export interface TherapistProfileDocument {
  id: string
  userId: string
  practiceId: string
  firstName: string
  lastName: string
  email: string
  biography?: string
  qualifications?: string[]
  specialisms?: string[]
  profileImagePath?: string
  workingHours: WorkingHoursObject
  status: 'active' | 'archived'
  archivedAt?: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 4: clients
// ============================================================

export interface ClientDocument {
  id: string
  clientRef: string                     // Format: {prefix}-{sequence} e.g. CHR-0001
  practiceId: string
  clientType: ClientType
  status: ClientStatus
  onboardingStage: OnboardingStage
  assignedTherapistId?: string

  // Personal details
  firstName: string
  lastName: string
  preferredName?: string
  pronouns?: string
  email: string
  phone?: string
  dateOfBirth?: string                  // YYYY-MM-DD
  address?: AddressObject
  diversityEthnicity?: string

  // Clinical vault — NEVER returned by portal-facing service functions
  // These fields are isolated in getClientForPortal and all portal-scoped reads
  previousTherapyHistory?: PreviousTherapyObject
  presentingIssues?: PresentingIssuesObject
  currentMedication?: MedicationObject
  safeguarding?: SafeguardingObject

  // Clinical admin (non-clinical operational fields)
  gpName?: string
  gpPractice?: string
  gpPhone?: string
  gpEmail?: string
  emergencyContact?: EmergencyContactObject

  // Portal access
  portalVisibility: PortalVisibilityObject

  // Scheduling
  recurringSchedule?: RecurringScheduleObject
  schedulingPaused: boolean             // Default: true. Must be explicitly enabled.

  // Billing
  creditBalance: number                 // Integer pence. Default: 0.
  creditCarryForwardPreference: 'carry_forward' | 'refund'
  sessionFeeOverridePence?: number      // Integer pence. Admin only.

  // Late fee management
  lateFeeCount: number                  // Default: 0

  // Invoice reminder overrides
  invoiceReminderOverride: boolean      // Default: false
  maxInvoiceReminders?: number
  invoiceReminderIntervalDays?: number

  // Retention and lifecycle
  retentionExpiresAt?: string
  archivedBy?: string
  archiveReason?: string
  archivedAt?: string
  createdAt: string
  updatedAt: string
}

// Clinical vault sub-types

export interface PreviousTherapyObject {
  hadTherapyBefore: boolean
  details?: string
}

export interface PresentingIssuesObject {
  description: string
  duration?: string
  dailyImpact?: string
}

export interface MedicationObject {
  takingMedication: boolean
  details?: string
}

export interface SafeguardingObject {
  receivingMentalHealthSupport: 'yes' | 'no' | 'prefer_not_to_say'
  safetyConcerns: 'yes' | 'no' | 'prefer_not_to_say'
}

export interface EmergencyContactObject {
  name: string
  relationship: string
  phone: string
}

// Portal-safe client type — returned by getClientForPortal
// Omits all four clinical vault fields
export type PortalSafeClient = Omit<
  ClientDocument,
  'previousTherapyHistory' | 'presentingIssues' |
  'currentMedication' | 'safeguarding'
>

// ============================================================
// COLLECTION 5: responsiblePersons
// ============================================================

export interface ResponsiblePersonDocument {
  id: string
  clientId: string
  userId?: string                       // Set when portal access is granted
  practiceId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  relationship: string
  hasPortalAccess: boolean
  canManageAppointments: boolean        // Default: true. Book, cancel, reschedule on client's behalf.
  canManageInvoices: boolean            // Default: true. Pay invoices on client's behalf.
  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 6: billingContacts
// ============================================================

export interface BillingContactDocument {
  id: string
  clientId: string
  practiceId: string
  name: string
  email: string
  phone?: string
  relationship?: string
  organisationName?: string
  hasPortalAccess: boolean
  userId?: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 7: consents
// ============================================================

export interface ConsentDocument {
  id: string
  clientId: string
  practiceId: string
  consentType: 'gdpr' | 'gp_contact' | 'emergency_contact' | 'marketing' | 'research'
  givenBy: string
  givenByUserId?: string
  method: 'digital' | 'verbal' | 'written'
  scope: string[]
  givenAt: string
  withdrawnAt?: string
}

// ============================================================
// COLLECTION 8: practiceNotes
// ============================================================

export interface PracticeNoteDocument {
  id: string
  clientId: string
  practiceId: string
  category: NoteCategory
  priority: NotePriority
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
  reminderAt?: string
  reminderRecipientRoles?: UserRole[]
  acknowledgedBy: string[]
  archivedAt?: string
}

// ============================================================
// COLLECTION 9: couplesEnquiries
// ============================================================

export interface CouplesEnquiryDocument {
  id: string
  practiceId: string
  client1Id: string
  client2Id?: string
  primaryBookingClientId: string
  status: 'pending_partner' | 'both_registered' | 'archived'
  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 10: waitingList
// ============================================================

export interface WaitingListDocument {
  id: string
  practiceId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  pathway: 'adult_self' | 'child' | 'adult_other' | 'couples'
  preferredTherapistId?: string
  briefReason?: string
  gdprConsent: boolean
  notifyWhenAvailable: boolean
  status: WaitingListStatus
  contactedAt?: string
  contactedBy?: string
  convertedClientId?: string
  removalReason?: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 11: appointments
// ============================================================

export interface AppointmentDocument {
  id: string
  practiceId: string
  clientIds: string[]                   // Array. One entry for individual, multiple for group/couples.
  therapistId: string
  roomId?: string
  appointmentTypeId: string
  startTime: string                     // ISO timestamp
  endTime: string                       // ISO timestamp
  slotEndTime: string                   // ISO timestamp. endTime + bufferMinutes. Used for conflict checks.
  durationMinutes: number
  bufferMinutes: number
  status: AppointmentStatus
  modality: SessionModality
  isGhost: boolean
  generatedByScheduler: boolean
  isManuallyModified: boolean           // Permanent once true. Scheduler never touches these.
  invoiced: boolean
  invoiceIds: string[]
  bankHolidayConflict: boolean
  roomConflict: boolean
  cancellationReason?: string           // Optional freetext. Never required. Never gates any action.
  notes?: string                        // Operational note. Not clinical.
  createdAt: string
  updatedAt: string
  createdBy: string
}

// ============================================================
// COLLECTION 12: appointmentTypes
// ============================================================

export interface AppointmentTypeDocument {
  id: string
  practiceId: string
  name: string
  durationMinutes: number
  bufferMinutes?: number                // Optional. Overrides practice.bufferMinutes when set.
  feePence: number                      // Integer pence. VAT-inclusive total.
  isClientBookable: boolean
  isActive: boolean
  isDefault: boolean
  supportedModalities: SessionModality[]
  isVatApplicable: boolean              // Defaults to practice VAT setting.
  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 13: rooms
// ============================================================

export interface RoomDocument {
  id: string
  practiceId: string
  name: string
  capacity: number                      // Determines max attendees for group sessions in this room.
  isActive: boolean
  isAccessible: boolean
  accessibilityNotes?: string
  equipmentTags: string[]
  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 14: leaveRecords
// ============================================================

export interface LeaveRecordDocument {
  id: string
  practiceId: string
  therapistId: string
  therapistName: string
  type: LeaveType
  startDate: string                     // YYYY-MM-DD
  endDate: string                       // YYYY-MM-DD
  status: LeaveStatus
  notes?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 15: calendarBlocks
// ============================================================

export interface CalendarBlockDocument {
  id: string
  practiceId: string
  type: 'practice_closure' | 'room_block' | 'therapist_block'
  label: string
  startDate: string                     // YYYY-MM-DD
  endDate: string                       // YYYY-MM-DD
  allDay: boolean
  startTime?: string                    // HH:mm
  endTime?: string                      // HH:mm
  therapistId?: string
  roomId?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 16: bankHolidays
// ============================================================

export interface BankHolidayDocument {
  id: string
  year: number
  dates: string[]                       // YYYY-MM-DD strings
  region: 'england-and-wales' | 'scotland' | 'northern-ireland'
}

// ============================================================
// COLLECTION 17: agreementTemplates
// ============================================================

export interface AgreementTemplateDocument {
  id: string
  practiceId: string
  isActive: boolean
  version: number
  contentHash: string
  sections: AgreementSectionObject[]
  createdBy: string
  supersededAt?: string
  supersededBy?: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 18: therapyAgreements
// ============================================================

export interface TherapyAgreementDocument {
  id: string
  clientId: string
  practiceId: string
  templateId: string
  templateVersion: number
  status: AgreementStatus
  renderedContent: string
  contentHash: string
  sentAt?: string
  sentBy?: string
  acceptedAt?: string
  acceptedByName?: string
  acceptedByIp?: string
  pdfContent?: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// COLLECTION 19: invoices
// ============================================================

export interface InvoiceDocument {
  id: string
  invoiceNumber: string                 // Format: {prefix}-{year}-{sequence}
  practiceId: string
  clientId: string
  billingContactId?: string
  recipientName: string
  recipientEmail: string
  appointmentIds: string[]
  lineItems: InvoiceLineItemObject[]
  subtotalPence: number                 // Integer pence
  vatAmountPence: number                // Integer pence. Calculated from total, not added on top.
  totalPence: number                    // Integer pence. Always the amount shown to users.
  paidPence: number                     // Integer pence
  creditAppliedPence: number            // Integer pence
  balancePence: number                  // Integer pence
  status: InvoiceStatus
  isLateFee: boolean
  isVatApplicable: boolean
  vatRate: number                       // e.g. 0.20
  reminderSentAt?: string
  reminderCount: number                 // Default: 0
  voidReason?: string
  dueDate?: string
  sentAt?: string
  paidAt?: string
  voidedAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

// ============================================================
// COLLECTION 20: creditTransactions
// ============================================================

export interface CreditTransactionDocument {
  id: string
  clientId: string
  practiceId: string
  type: CreditTransactionType
  amountPence: number                   // Integer pence. Positive for credit, negative for application.
  balanceAfterPence: number             // Integer pence. Running balance after this transaction.
  invoiceId?: string
  description: string
  createdAt: string
  createdBy: string
}

// ============================================================
// COLLECTION 21: onboardingTokens
// ============================================================

export interface OnboardingTokenDocument {
  id: string
  clientId: string
  practiceId: string
  type: TokenType
  tokenHash: string                     // SHA-256 hash. Raw token is never stored.
  used: boolean
  expiresAt: string                     // 72 hours from creation
  createdAt: string
}

// ============================================================
// COLLECTION 22: notifications
// ============================================================

export interface NotificationDocument {
  id: string
  recipientUserId: string
  recipientRole: UserRole
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  linkTo?: string
  createdAt: string
  readAt?: string
  dismissedAt?: string
  expiresAt?: string
}

// ============================================================
// COLLECTION 23: auditLog
// ============================================================

export interface AuditLogEntry {
  id: string
  userId: string                        // 'system' for automated actions
  userRole: string
  action: string                        // dot-notation: 'client.created', 'invoice.voided'
  resourceType: string
  resourceId: string
  timestamp: string
  detail?: Record<string, unknown>
}

// ============================================================
// COLLECTION 24: adminAlerts
// ============================================================

export interface AdminAlertDocument {
  id: string
  practiceId: string
  type: AdminAlertType
  severity: AdminAlertSeverity
  message: string
  clientId?: string
  clientRef?: string
  appointmentId?: string
  therapistId?: string
  resolved: boolean
  resolvedAt?: string
  resolvedBy?: string
  createdAt: string
}

// ============================================================
// NON-COLLECTION TYPES
// ============================================================

export interface AvailableSlot {
  therapistId: string
  therapistName: string
  date: string                          // YYYY-MM-DD
  startTime: string                     // HH:mm
  endTime: string                       // HH:mm
  slotEndTime: string                   // HH:mm (includes buffer)
  appointmentTypeId: string
  durationMinutes: number
  bufferMinutes: number
  supportedModalities: SessionModality[]
}

export interface SchedulingRunResult {
  practiceId: string
  clientsProcessed: number
  appointmentsCreated: number
  alertsCreated: number
  errors: SchedulingError[]
  ranAt: string
}

export interface SchedulingError {
  clientId: string
  clientRef?: string
  error: string
}

export interface ClientExportBundle {
  exportedAt: string
  requestedBy: string
  format: ExportFormat
  includesClinicalData: boolean         // true for admin exports, false for client self-exports
  client: PortalSafeClient | ClientDocument
  responsiblePersons: ResponsiblePersonDocument[]
  billingContacts: BillingContactDocument[]
  consents: ConsentDocument[]
  agreements: TherapyAgreementDocument[]
  appointments: AppointmentDocument[]
  invoices: InvoiceDocument[]
  creditTransactions: CreditTransactionDocument[]
}

export interface AuthenticatedUser {
  id: string                            // Firebase Auth UID = Firestore user document ID
  email: string
  currentRole: UserRole
  activeRoles: UserRole[]
  practiceId: string
}

export interface RoleSelectionRequired {
  userId: string
  activeRoles: UserRole[]
}
