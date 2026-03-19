# QuickBase Field Map — Core Ops App (br9kwm8bk)
## Generated 2026-03-10 from live QB API

---

## Projects Table (br9kwm8na)

| FID | Label | Type |
|-----|-------|------|
| 3 | Record ID# | recordid |
| 6 | Project Name | text |
| 10 | Project Status - Formula | text |
| 13 | System Size(kW) | numeric |
| 70 | Lender - Lookup | text |
| 145 | Customer Name | text |
| 148 | Mobile Phone | phone |
| 149 | Email | email |
| 165 | Survey Approved Date | date |
| 189 | Customer - State | text |
| 208 | Permit Approved | date |
| 226 | Inspection Scheduled Date | date |
| 255 | Status | text-multiple-choice |
| 315 | Design Completed | date |
| 327 | NEM Approved Date | date |
| 330 | Setter | text |
| 339 | Sales Office | text |
| 344 | Lender | text-multiple-choice |
| 347 | Intake Status | text-multiple-choice |
| 355 | Closer | text |
| 391 | Office - Name | text-multiple-choice |
| 437 | Cancellation Date | date |
| 461 | Intake Completed Date | timestamp |
| 491 | Passing Inspection Completed Date | date |
| 509 | Install Completed | checkbox |
| 522 | Sales Date | timestamp |
| 534 | Install Completed Date | date |
| 538 | PTO Approved Date | date |
| 695 | Sale Date | date |
| 969 | Site Survey Scheduled | timestamp |
| 974 | KCA_Status | text |
| 1145 | SALE to INSTALL C (Cal Days) | numeric |
| 1458 | CS Handoff - Inspection Passed Date/Time | timestamp |
| 164 | Survey Submitted Date | date |
| 166 | Survey Scheduled Date | date |
| 178 | Install Scheduled Start Date | date |
| 207 | Permit Submitted | date |
| 326 | NEM Submitted Date | date |
| 491 | Passing Inspection Completed Date | date |
| 537 | PTO Submitted Date | date |
| 699 | Minimum Initial Design CAD Design Submitted | date |
| 706 | Maximum Permit Rejected/Revisions Needed | timestamp |
| 1878 | NEM Rejected/Needs Revisions | date |

### Milestone Color Mapping:
- **Red** = Rejected (FID 706 Permit Rejected, FID 1878 NEM Rejected)
- **Yellow** = Submitted/Started (FID 164 SS Submitted, FID 699 CAD Submitted, FID 207 Permit Submitted, FID 326 NEM Submitted, FID 537 PTO Submitted)
- **Green** = Approved/Completed (FID 165 SS Approved, FID 315 Design Completed, FID 208 Permit Approved, FID 327 NEM Approved, FID 534 Install Completed, FID 491 Inspection Passed, FID 538 PTO Approved)
- **Blue** = Scheduled (FID 166 SS Scheduled, FID 178 Install Scheduled, FID 226 Inspection Scheduled)
- **Purple 'S'** = Service tickets from Arrivy

### Dashboard field label mapping (from discoverFields):
- "Sales Date" → 522
- "Customer Name" → 145
- "Customer - State" → 189
- "System Size(kW)" → 13
- "Closer" → 355
- "Setter" → 330
- "Sales Office" → 339
- "Status" → 255
- "Intake Completed Date" → 461
- "Lender" → 344
- "Site Survey Scheduled" → 969
- "Survey Approved Date" → 165
- "Design Completed" → 315
- "NEM Approved Date" → 327
- "Permit Approved" → 208
- "Install Completed Date" → 534
- "PTO Approved Date" → 538

---

## ArrivyTasks Table (bvbqgs5yc)

| FID | Label | Type |
|-----|-------|------|
| 3 | Record ID# | recordid |
| 6 | Related Project | numeric |
| 47 | Official: Customer First Name | text |
| 48 | Official: Customer Last Name | text |
| 52 | Official: Customer State | text |
| 56 | Official: Arrivy Template Name | text |
| 85 | Official: Task Status | text |
| 97 | Official: Task Submitted Date/Time | timestamp |
| 107 | View Task (URL) | url |
| 115 | Official: Scheduled Date/Time | timestamp |
| 116 | Arrivy Logs: Status = Enroute? | checkbox |
| 117 | Arrivy Logs: Status = Started? | checkbox |
| 119 | Project - Closer | text |
| 121 | Max Form Complete Record ID# - reporter_name | text |
| 137 | Official: Tech Complete Date/Time | timestamp |
| 140 | Max Task Complete - reporter_name | text |
| 145 | Max Enroute Record ID# - reporter_name | text |
| 146 | Official: Enroute Date/Time | timestamp |
| 198 | Project - System Size(kW) | numeric |
| 238 | Project - Status | text |
| 268 | Assigned Task Crew Name | multitext |
| 269 | Project - Install Completed Date | date |
| 270 | Is Install Complete? | text |

---

## Tickets Table (bstdqwrkg)

| FID | Label | Type |
|-----|-------|------|
| 1 | Date/Time Created | timestamp |
| 3 | Record ID# | recordid |
| 4 | Ticket Creator | user |
| 19 | Record Title | text |
| 20 | Description | text-multi-line |
| 23 | Date Created | date |
| 26 | Related Project | numeric |
| 27 | Project - Full Name | text |
| 35 | Project - Sale Date | date |
| 36 | Project - Status | text |
| 42 | Project - System Size (kW) | numeric |
| 44 | Project - Closer | text |
| 46 | Related Category | numeric |
| 47 | Category | text |
| 49 | Related Ticket Issue | numeric |
| 50 | Ticket Issue | text |
| 52 | Due Date | date |
| 59 | Completed Timestamp | timestamp |
| 67 | Assigned To (Reportable) | text |
| 85 | Project Coordinator | text |
| 87 | Ticket Priority | text-multiple-choice |
| 88 | Custom Ticket Issue | text |
| 91 | Ticket Status | text-multiple-choice |
| 95 | Official Due Date | date |
| 100 | Assigned To | user |
| 108 | Ticket Disposition | text-multiple-choice |
| 109 | View Ticket | url |

---

## Notes Table (bsb6bqt3b)

| FID | Label | Type |
|-----|-------|------|
| 1 | Date Created | timestamp |
| 3 | Record ID# | recordid |
| 6 | Note | text-multi-line |
| 7 | Category | text-multiple-choice |
| 8 | Date | timestamp |
| 9 | Note by | user |
| 13 | Related Project | numeric |
| 14 | Project - Full Name | text |
| 35 | Project - Status | text |
| 38 | Type | text-multiple-choice |
| 39 | Disposition | text-multiple-choice |
| 40 | Follow-Up Needed | checkbox |
| 41 | Follow-Up Date | timestamp |

---

## Intake Events Table (bt4a8ypkq)

(Fields from dashboard discoverFields):
- 1: Date Created
- 106: Full Name
- 40: Reportable: Installation Agreement
- 46: Reportable: Finance Approved
- 48: Reportable: Full Utility Bill
- 55: Reportable: Consumption Audit
- 58: Reportable: Site Survey Scheduled
- 61: Reportable: Welcome Call Scheduled
- 67: Reportable: Adders
- 74: Intake Approved Date/Time
- 215: Project - Intake Status
- 165: Project - Closer
- 255: Project - Sale Date
- 210: Project - Status
- 272: Project - Max Intake Event: Record ID#

---

## ArrivyTaskLog Table (bvbbznmdb)

| FID | Label | Type |
|-----|-------|------|
| 3 | Record ID# | recordid |
| 6 | id | text |
| 15 | title | text |
| 23 | status | text |
| 24 | status_title | text |
| 50 | template | text |
| 73 | event_title | text |
| 74 | event_message | text |
| 75 | event_id | text |
| 76 | event_type | text |
| 77 | event_sub_type | text |
| 79 | event_time | text |
| 81 | reporter_name | text |
| 82 | object_id | text |
| 83 | object_type | text |
| 94 | Related Task (Calc) | numeric (FK → ArrivyTasks RID) |
| 121 | Form Meta Data: Form ID | numeric |
| 124 | Arrivy Input: Status Title | text |
| 125 | Arrivy Input: Status Type | text |
| 127 | Arrivy Input: Status Notes | text-multi-line |
| 128 | Arrivy Input: Status Description | text |
| 169 | RTR Status | text-multiple-choice |
| 170 | RTR Install Status | text-multiple-choice |
| 193 | Related Task (Calc) - Related Project | numeric (lookup → Projects RID) |

### Survey Disposition Detection:
- **Cancelled**: ArrivyTaskLog entries where status_title, event_type, event_sub_type, event_title, or event_message contain "cancel"
- **Rescheduled**: ArrivyTaskLog entries where those fields contain "reschedul"
- Query by `Related Task (Calc)` FID 94 (numeric FK, no quotes): `{94.EX.<arrivyTaskRecordId>}`

---

## Events Table (bsbguxz4i)

(Used for field events on dashboard - same structure as ArrivyTasks child events)

---

## Code Pages in QB

| Page Name | Page ID |
|-----------|---------|
| cc-quick-glance.html | 124 |
| qb-skin-project-detail.html | 126 |
| qb-skin-core.js | 127 |
| qb-skin-styles.css | 128 |
| qb-skin-tasks.html | 129 |
| qb-skin-labor.html | 130 |
| qb-skin-trends.html | 131 |
