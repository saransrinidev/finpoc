/* Seed data for the demo. app.js copies this into its live state. */
window.SEED = {
  roles: {
    employee: {
      label: "Employee",
      user: { name: "Devon Vance", title: "Senior Consultant", initials: "DV" },
      approver: "manager",
      nav: [
        { id: "dashboard", label: "Dashboard", icon: "dashboard" },
        { id: "timesheets", label: "My Timesheets", icon: "clock" },
        { id: "expenses", label: "My Expenses", icon: "receipt" },
        { id: "reimbursements", label: "Reimbursements", icon: "wallet" }
      ]
    },
    manager: {
      label: "Manager",
      user: { name: "Priya Shah", title: "Delivery Manager", initials: "PS" },
      approver: "admin",
      nav: [
        { id: "dashboard", label: "Dashboard", icon: "dashboard" },
        { id: "approvals", label: "Approvals", icon: "approvals", badge: true },
        { id: "team", label: "Team", icon: "users" },
        { id: "projects", label: "Projects", icon: "folder" },
        { id: "timesheets", label: "My Timesheets", icon: "clock" },
        { id: "expenses", label: "My Expenses", icon: "receipt" },
        { id: "reports", label: "Reports", icon: "reports" }
      ]
    },
    admin: {
      label: "Admin",
      user: { name: "Sarah Jenkins", title: "VP Operations", initials: "SJ" },
      approver: null,
      nav: [
        { id: "dashboard", label: "Dashboard", icon: "dashboard" },
        { id: "timesheets", label: "Timesheets", icon: "clock" },
        { id: "expenses", label: "Expenses", icon: "receipt" },
        { id: "approvals", label: "Approvals", icon: "approvals", badge: true },
        { id: "reports", label: "Reports & Invoicing", icon: "reports" },
        { id: "reimbursements", label: "Payouts", icon: "wallet" },
        { id: "settings", label: "Policy & Settings", icon: "settings" }
      ]
    }
  },

  projects: [
    { code: "NWR-204", name: "ERP Rollout", client: "Northwind Retail", type: "Time & Materials", budget: 1200, used: 1044, due: "Jan 03" },
    { code: "GBX-118", name: "Data Migration", client: "Globex Health", type: "Fixed Fee", budget: 800, used: 512, due: "Feb 18" },
    { code: "ACM-301", name: "Process Audit", client: "Acme Logistics", type: "Time & Materials", budget: 400, used: 388, due: "Nov 27" },
    { code: "INI-077", name: "Cloud Readiness", client: "Initech", type: "Retainer", budget: 300, used: 96, due: "Apr 19" }
  ],

  categories: ["Travel", "Lodging", "Meals", "Ground Transport", "Software", "Office Supplies"],

  timesheets: {
    employee: {
      week: "Nov 16 – Nov 22, 2026",
      days: ["Mon 16", "Tue 17", "Wed 18", "Thu 19", "Fri 20", "Sat 21", "Sun 22"],
      status: "Draft",
      rows: [
        { project: "Northwind Retail — ERP Rollout", code: "NWR-204", task: "Solution design", billable: true, hours: [4, 3.5, 4, 0, 0, 0, 0] },
        { project: "Globex Health — Data Migration", code: "GBX-118", task: "Data mapping", billable: true, hours: [3, 3.5, 3, 0, 0, 0, 0] },
        { project: "Internal", code: "INT-001", task: "Training & admin", billable: false, hours: [1, 1, 0.5, 0, 0, 0, 0] }
      ],
      history: [
        { period: "Nov 09 – Nov 15", hours: 41.5, billable: 36, status: "Approved", approver: "Priya Shah" },
        { period: "Nov 02 – Nov 08", hours: 40, billable: 34.5, status: "Approved", approver: "Priya Shah" },
        { period: "Oct 26 – Nov 01", hours: 41.5, billable: 36, status: "Approved", approver: "Priya Shah" },
        { period: "Oct 19 – Oct 25", hours: 38, billable: 33, status: "Approved", approver: "Priya Shah" }
      ]
    },
    manager: {
      week: "Nov 16 – Nov 22, 2026",
      days: ["Mon 16", "Tue 17", "Wed 18", "Thu 19", "Fri 20", "Sat 21", "Sun 22"],
      status: "Draft",
      rows: [
        { project: "Northwind Retail — ERP Rollout", code: "NWR-204", task: "Engagement management", billable: true, hours: [3, 3, 2.5, 0, 0, 0, 0] },
        { project: "Acme Logistics — Process Audit", code: "ACM-301", task: "Quality review", billable: true, hours: [2, 2.5, 2, 0, 0, 0, 0] },
        { project: "Internal", code: "INT-001", task: "Team management", billable: false, hours: [3, 2.5, 3.5, 0, 0, 0, 0] }
      ],
      history: [
        { period: "Nov 09 – Nov 15", hours: 40, billable: 24, status: "Approved", approver: "Sarah Jenkins" },
        { period: "Nov 02 – Nov 08", hours: 42, billable: 26, status: "Approved", approver: "Sarah Jenkins" },
        { period: "Oct 26 – Nov 01", hours: 40, billable: 23.5, status: "Approved", approver: "Sarah Jenkins" }
      ]
    }
  },

  expenses: {
    employee: [
      { id: "EXP-1042", date: "Nov 12", merchant: "Delta Air Lines", category: "Travel", project: "NWR-204", amount: 412.3, status: "Submitted", receipt: true },
      { id: "EXP-1041", date: "Nov 11", merchant: "Marriott Chicago", category: "Lodging", project: "NWR-204", amount: 486.0, status: "Approved", receipt: true },
      { id: "EXP-1039", date: "Nov 10", merchant: "Uber", category: "Ground Transport", project: "NWR-204", amount: 38.75, status: "Draft", receipt: false },
      { id: "EXP-1035", date: "Nov 05", merchant: "Capital Grille — client dinner", category: "Meals", project: "GBX-118", amount: 218.6, status: "Approved", receipt: true },
      { id: "EXP-1031", date: "Oct 29", merchant: "Staples", category: "Office Supplies", project: "INT-001", amount: 42.15, status: "Rejected", receipt: true, note: "Personal purchase" }
    ],
    manager: [
      { id: "EXP-1047", date: "Nov 11", merchant: "United Airlines", category: "Travel", project: "NWR-204", amount: 528.4, status: "Approved", receipt: true },
      { id: "EXP-1044", date: "Nov 09", merchant: "Steering committee lunch", category: "Meals", project: "NWR-204", amount: 164.0, status: "Paid", receipt: true }
    ]
  },

  approvals: {
    manager: [
      { id: "TS-880", type: "Timesheet", name: "Elena Rostova", tone: "mint", detail: "Nov 09 – Nov 15", hours: 40, submitted: "Nov 15" },
      { id: "TS-882", type: "Timesheet", name: "Tom Becker", tone: "amber", detail: "Nov 09 – Nov 15", hours: 38, submitted: "Nov 16", flag: "Late submission" },
      { id: "EXP-1042", type: "Expense", name: "Devon Vance", tone: "blue", detail: "Delta Air Lines · Travel", amount: 412.3, submitted: "Nov 12" },
      { id: "EXP-1053", type: "Expense", name: "Aisha Bello", tone: "blue", detail: "Hilton Boston · Lodging", amount: 312.0, submitted: "Nov 12" },
      { id: "EXP-1056", type: "Expense", name: "Tom Becker", tone: "amber", detail: "Workshop supplies · Office Supplies", amount: 96.4, submitted: "Nov 13", flag: "Missing receipt" },
      { id: "EXP-1058", type: "Expense", name: "Lena Park", tone: "mint", detail: "Amtrak · Travel", amount: 64.2, submitted: "Nov 13" },
      { id: "EXP-1061", type: "Expense", name: "Jonah Reyes", tone: "blue", detail: "Team dinner · Meals", amount: 286.0, submitted: "Nov 14", flag: "Over per-person limit" }
    ],
    admin: [
      { id: "TS-874", type: "Timesheet", name: "Devon Vance", tone: "blue", detail: "Nov 09 – Nov 15", hours: 41.5, submitted: "Nov 15", flag: "Overtime 1.5h" },
      { id: "EXP-1050", type: "Expense", name: "Elena Rostova", tone: "mint", detail: "Client lunch · Meals", amount: 218.6, submitted: "Nov 13" },
      { id: "EXP-1052", type: "Expense", name: "Marcus Chen", tone: "blue", detail: "JetBrains license · Software", amount: 850.0, submitted: "Nov 12", flag: "Over $500 limit" },
      { id: "TS-876", type: "Timesheet", name: "Aisha Bello", tone: "blue", detail: "Nov 09 – Nov 15", hours: 42, submitted: "Nov 15", flag: "Overtime 2h" },
      { id: "TS-879", type: "Timesheet", name: "Lena Park", tone: "mint", detail: "Nov 09 – Nov 15", hours: 36, submitted: "Nov 15" }
    ]
  },

  team: [
    { name: "Devon Vance", title: "Senior Consultant", tone: "blue", hours: 41.5, billable: 36, status: "Approved" },
    { name: "Elena Rostova", title: "Consultant", tone: "mint", hours: 40, billable: 33, status: "Submitted" },
    { name: "Marcus Chen", title: "Analyst", tone: "blue", hours: 38, billable: 30, status: "Approved" },
    { name: "Aisha Bello", title: "Senior Consultant", tone: "blue", hours: 42, billable: 39, status: "Approved" },
    { name: "Tom Becker", title: "Consultant", tone: "amber", hours: 38, billable: 27, status: "Submitted" },
    { name: "Lena Park", title: "Analyst", tone: "mint", hours: 36, billable: 28, status: "Approved" },
    { name: "Jonah Reyes", title: "Consultant", tone: "blue", hours: 22, billable: 18, status: "Not submitted" }
  ],

  orgTimesheets: [
    { team: "Advisory — East", manager: "Priya Shah", headcount: 7, submitted: 6, approved: 4, hours: 257.5, billable: 211 },
    { team: "Advisory — West", manager: "Daniel Ortiz", headcount: 9, submitted: 9, approved: 8, hours: 362, billable: 318 },
    { team: "Data & Analytics", manager: "Mei Lin", headcount: 12, submitted: 10, approved: 7, hours: 401.5, billable: 349.5 },
    { team: "Cloud Engineering", manager: "Rahul Mehta", headcount: 14, submitted: 12, approved: 9, hours: 486, billable: 431 },
    { team: "Operations", manager: "Grace Kim", headcount: 6, submitted: 6, approved: 6, hours: 238, billable: 96 }
  ],

  missing: [
    { name: "Jonah Reyes", team: "Advisory — East", logged: 22 },
    { name: "Kevin Wu", team: "Data & Analytics", logged: 16 },
    { name: "Sara Holm", team: "Data & Analytics", logged: 0 },
    { name: "Omar Faris", team: "Cloud Engineering", logged: 31.5 },
    { name: "Nina Patel", team: "Cloud Engineering", logged: 8 }
  ],

  ledger: [
    { id: "EXP-1061", date: "Nov 14", name: "Jonah Reyes", merchant: "Team dinner", category: "Meals", amount: 286.0, flag: "Over per-person limit", status: "Submitted" },
    { id: "EXP-1058", date: "Nov 13", name: "Lena Park", merchant: "Amtrak", category: "Travel", amount: 64.2, flag: "", status: "Approved" },
    { id: "EXP-1056", date: "Nov 13", name: "Tom Becker", merchant: "Workshop supplies", category: "Office Supplies", amount: 96.4, flag: "Missing receipt", status: "Submitted" },
    { id: "EXP-1053", date: "Nov 12", name: "Aisha Bello", merchant: "Hilton Boston", category: "Lodging", amount: 312.0, flag: "", status: "Approved" },
    { id: "EXP-1052", date: "Nov 12", name: "Marcus Chen", merchant: "JetBrains license", category: "Software", amount: 850.0, flag: "Over $500 limit", status: "Approved" },
    { id: "EXP-1042", date: "Nov 12", name: "Devon Vance", merchant: "Delta Air Lines", category: "Travel", amount: 412.3, flag: "", status: "Submitted" },
    { id: "EXP-1050", date: "Nov 11", name: "Elena Rostova", merchant: "Client lunch", category: "Meals", amount: 218.6, flag: "", status: "Approved" },
    { id: "EXP-1041", date: "Nov 11", name: "Devon Vance", merchant: "Marriott Chicago", category: "Lodging", amount: 486.0, flag: "", status: "Approved" },
    { id: "EXP-1029", date: "Nov 03", name: "Kevin Wu", merchant: "Apple Store", category: "Office Supplies", amount: 1299.0, flag: "Personal item", status: "Rejected" },
    { id: "EXP-1018", date: "Oct 28", name: "Nina Patel", merchant: "Uber", category: "Ground Transport", amount: 42.8, flag: "", status: "Paid" }
  ],

  spendByCategory: [
    { label: "Travel", value: 18420 },
    { label: "Lodging", value: 12860 },
    { label: "Meals", value: 6940 },
    { label: "Software", value: 5310 },
    { label: "Ground Transport", value: 2680 },
    { label: "Office Supplies", value: 2000 }
  ],

  invoices: [
    { id: "INV-2026-118", client: "Northwind Retail", project: "NWR-204", basis: "182.0 hrs · T&M", amount: 28400, status: "Ready", due: "—" },
    { id: "INV-2026-117", client: "Globex Health", project: "GBX-118", basis: "Milestone 3 · Fixed fee", amount: 18240, status: "Ready", due: "—" },
    { id: "INV-2026-116", client: "Acme Logistics", project: "ACM-301", basis: "116.0 hrs · T&M", amount: 11600, status: "Ready", due: "—" },
    { id: "INV-2026-115", client: "Initech", project: "INI-077", basis: "November retainer", amount: 5200, status: "Ready", due: "—" },
    { id: "INV-2026-112", client: "Northwind Retail", project: "NWR-204", basis: "198.5 hrs · T&M", amount: 31200, status: "Paid", due: "Nov 19" },
    { id: "INV-2026-110", client: "Globex Health", project: "GBX-118", basis: "Milestone 2 · Fixed fee", amount: 16880, status: "Sent", due: "Nov 24" },
    { id: "INV-2026-104", client: "Acme Logistics", project: "ACM-301", basis: "94.5 hrs · T&M", amount: 9450, status: "Overdue", due: "Nov 03" }
  ],

  payout: {
    id: "BATCH-1101",
    date: "Nov 20, 2026",
    status: "Scheduled",
    lines: [
      { name: "Devon Vance", receipts: 2, amount: 704.6, account: "ACH ••4821" },
      { name: "Elena Rostova", receipts: 1, amount: 218.6, account: "ACH ••1190" },
      { name: "Aisha Bello", receipts: 1, amount: 312.0, account: "ACH ••7734" },
      { name: "Lena Park", receipts: 1, amount: 64.2, account: "ACH ••5521" },
      { name: "Tom Becker", receipts: 2, amount: 189.1, account: "ACH ••3307" }
    ]
  },

  payoutHistory: [
    { id: "BATCH-1018", date: "Nov 06, 2026", receipts: 12, amount: 3912.4, status: "Paid" },
    { id: "BATCH-1004", date: "Oct 23, 2026", receipts: 9, amount: 2206.75, status: "Paid" },
    { id: "BATCH-0920", date: "Oct 09, 2026", receipts: 14, amount: 4518.1, status: "Paid" }
  ],

  myPayouts: [
    { id: "PAY-2210", date: "Nov 20, 2026", items: 2, amount: 704.6, method: "ACH ••4821", status: "Scheduled" },
    { id: "PAY-2187", date: "Nov 06, 2026", items: 3, amount: 612.4, method: "ACH ••4821", status: "Paid" },
    { id: "PAY-2152", date: "Oct 23, 2026", items: 1, amount: 129.0, method: "ACH ••4821", status: "Paid" },
    { id: "PAY-2101", date: "Oct 09, 2026", items: 4, amount: 1046.85, method: "ACH ••4821", status: "Paid" }
  ],

  settings: {
    autoApprove: true,
    receiptOver25: true,
    financeOver500: true,
    overtimeAlerts: true,
    weekendEntry: false,
    lockAfterClose: true
  },

  policies: [
    { category: "Air travel", limit: "Economy class", receipt: "Required", approval: "Manager" },
    { category: "Lodging", limit: "$250 / night", receipt: "Required", approval: "Manager" },
    { category: "Meals", limit: "$75 / person / day", receipt: "Over $25", approval: "Manager" },
    { category: "Ground transport", limit: "$100 / trip", receipt: "Over $25", approval: "Manager" },
    { category: "Software", limit: "$500 / item", receipt: "Required", approval: "Manager + Finance" }
  ],

  integrations: [
    { name: "NetSuite", desc: "General ledger, invoices and AR", status: "Connected", meta: "Synced 14m ago" },
    { name: "ADP Workforce", desc: "Payroll and reimbursements via ACH", status: "Connected", meta: "Next run Nov 20" },
    { name: "Okta", desc: "Single sign-on and user provisioning", status: "Connected", meta: "48 active users" },
    { name: "Slack", desc: "Approval requests and reminders", status: "Not connected", meta: "" }
  ]
};
