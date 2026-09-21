import type {
  ClassificationDataset,
  EmailPresentation,
  ReviewQueueItem,
} from "@/types/averis";

export const classificationData: ClassificationDataset = {
  email_001: {
    email_id: "email_001",
    category: "comparison_request",
    confidence: 0.98,
    status: "mismatch",
    needs_review: false,
    review_reason: null,
    comparison: {
      si_doc_type_detected: "SI",
      bl_doc_type_detected: "BL",
      fields: [
        { field: "shipper", si_value: "Acme Pte Ltd", bl_value: "Acme Pte Ltd", match: true },
        { field: "consignee", si_value: "Globex Corp", bl_value: "Globex Corp", match: true },
        { field: "notify_party", si_value: "Globex Corp", bl_value: "Globex Corp", match: true },
        { field: "port_of_loading", si_value: "Port Klang", bl_value: "Port Klang", match: true },
        { field: "port_of_discharge", si_value: "Rotterdam", bl_value: "Rotterdam", match: true },
        { field: "container_count", si_value: "3", bl_value: "4", match: false },
        { field: "gross_weight_kg", si_value: "22000", bl_value: "22000", match: true },
      ],
      summary: "1 of 7 fields mismatched: container_count",
    },
  },
  email_007: {
    email_id: "email_007",
    category: "comparison_request",
    confidence: 0.95,
    status: "match",
    needs_review: false,
    review_reason: null,
    comparison: {
      si_doc_type_detected: "SI",
      bl_doc_type_detected: "BL",
      fields: [],
      summary: "No mismatch detected.",
    },
  },
  email_507: {
    email_id: "email_507",
    category: "comparison_request",
    confidence: 0.9,
    status: "escalated",
    needs_review: true,
    review_reason: {
      code: "comparison_request_missing_bl",
      message: "Comparison request has no BL attachment to compare against.",
    },
    comparison: null,
  },
  email_002: {
    email_id: "email_002",
    category: "invoice_query",
    confidence: 0.97,
    status: "not_applicable",
    needs_review: false,
    review_reason: null,
    comparison: null,
  },
};

export const emailPresentation: Record<string, EmailPresentation> = {
  email_001: { sender: "Maersk Logistics Services", initials: "ML", subject: "BL-9920334 · Port Klang to Rotterdam", reference: "SI-2024-0012", received: "10:42 AM" },
  email_007: { sender: "Kuehne + Nagel Intl", initials: "KN", subject: "BL-2024-00145 · Rotterdam Terminal", reference: "SI-2024-0015", received: "9:15 AM" },
  email_507: { sender: "DHL Global Forwarding", initials: "DG", subject: "AWB-771290 · Missing BL attachment", reference: "SI-2024-0019", received: "Yesterday" },
  email_002: { sender: "CMA CGM Logistics", initials: "CG", subject: "INV-525007 · Local charge breakdown", reference: "INV-525007", received: "Oct 24, 2026" },
  email_general: { sender: "MSC Mediterranean Shipping", initials: "MS", subject: "SWB-654012 · Jebel Ali Port Entry", reference: "SI-2024-0022", received: "Yesterday" },
  email_new_si: { sender: "Hapag-Lloyd AG", initials: "HL", subject: "New shipping instruction · Singapore", reference: "SI-2024-0025", received: "8:56 AM" },
  email_spam: { sender: "External Promotions", initials: "EP", subject: "Exclusive freight offer expires today", reference: "EXT-00918", received: "Oct 23, 2026" },
};

export const supplementalEmails = [
  { email_id: "email_general", category: "general", confidence: 0.92, status: "not_applicable", needs_review: false, review_reason: null, comparison: null },
  { email_id: "email_new_si", category: "new_si_request", confidence: 0.621, status: "not_applicable", needs_review: false, review_reason: null, comparison: null },
  { email_id: "email_spam", category: "spam", confidence: 0.452, status: "not_applicable", needs_review: false, review_reason: null, comparison: null },
] as const;

export const reviewQueue: ReviewQueueItem[] = [
  { id: "REV-9402", emailId: "email_001", reference: "BL-2024-00129", issue: "Critical Weight Mismatch", assignee: "Marcus Chen", pending: "4h 12m", priority: "high", requiresReview: true },
  { id: "REV-9405", emailId: "email_507", reference: "BL-2024-00145", issue: "Missing BL Attachment", assignee: "Sarah Jenkins", pending: "1h 45m", priority: "high", requiresReview: true },
  { id: "REV-9410", emailId: "email_007", reference: "BL-2024-00158", issue: "Invalid Port Code", assignee: "Unassigned", pending: "22m", priority: "medium", requiresReview: false },
  { id: "REV-9412", emailId: "email_002", reference: "BL-2024-00162", issue: "Formatting Error", assignee: "Marcus Chen", pending: "15m", priority: "low", requiresReview: false },
];

export const categoryLabels = {
  comparison_request: "Comparison Request",
  new_si_request: "New SI Request",
  invoice_query: "Invoice Query",
  general: "General",
  spam: "Spam",
} as const;