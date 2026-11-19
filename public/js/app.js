/* App state, routing, role switching and user actions. */

const ROLE_KEY = "digian-role";
const COLLAPSE_KEY = "digian-sidebar-collapsed";

const S = structuredClone(window.SEED);
S.role = S.roles[localStorage.getItem(ROLE_KEY)] ? localStorage.getItem(ROLE_KEY) : "admin";
S.ui = { expFilter: "All", apprTab: "All", ledgerFilter: "All", selected: new Set(), reminded: new Set() };
let nextExpenseId = 1070;

const $ = (sel, el) => (el || document).querySelector(sel);
const app = $("#app");
const view = $("#view");
const mobile = window.matchMedia("(max-width: 900px)");

/* ---------------- Routing ---------------- */

function currentPage() {
  const page = (location.hash.replace(/^#\/?/, "") || "dashboard").split("?")[0];
  return VIEWS[S.role][page] ? page : "dashboard";
}

function currentNav() {
  const page = currentPage();
  return S.roles[S.role].nav.find((n) => n.id === page);
}

let lastRenderKey = "";

function render() {
  const role = S.roles[S.role];
  const page = currentPage();
  const renderKey = `${S.role}:${page}`;

  // Sidebar navigation
  $("#nav").innerHTML = role.nav
    .map((n) => {
      const count = n.badge ? S.approvals[S.role].length : 0;
      return `<a href="#/${n.id}" class="nav-item ${n.id === page ? "active" : ""}" title="${esc(n.label)}" ${n.id === page ? 'aria-current="page"' : ""}>
        ${icon(n.icon)}<span class="label">${esc(n.label)}</span>${count ? `<span class="nav-badge">${count}<span class="sr-only"> waiting</span></span>` : ""}
      </a>`;
    })
    .join("");

  // Top bar
  $("#crumbCurrent").textContent = currentNav().label;
  $("#userName").textContent = role.user.name;
  $("#userRole").textContent = role.user.title;
  $("#roleMenuList").innerHTML = Object.entries(S.roles)
    .map(([key, r]) => `<button class="menu-item ${key === S.role ? "active" : ""}" role="menuitemradio" aria-checked="${key === S.role}" data-role="${key}">
        <div class="so-avatar blue">${r.user.initials}</div>
        <div class="so-info"><div class="so-name">${esc(r.label)}</div><div class="so-meta">${esc(r.user.name)} · ${esc(r.user.title)}</div></div>
        ${key === S.role ? icon("check", "menu-check") : ""}
      </button>`)
    .join("");

  // Page
  view.innerHTML = VIEWS[S.role][page]();
  view.dataset.page = page;
  document.title = `${currentNav().label} · Digian`;

  // Tell the motion layer (js/motion.js) only when the page or role changed,
  // not on in-page updates such as ticking a checkbox.
  if (renderKey !== lastRenderKey) {
    lastRenderKey = renderKey;
    document.dispatchEvent(new CustomEvent("digian:pagechange", { detail: { page, role: S.role } }));
  }
}

function go(page) {
  if (location.hash === `#/${page}`) render();
  else location.hash = `#/${page}`;
}

// Move keyboard and screen-reader focus to the new page's heading.
function focusPageTitle() {
  const h = $("#pageTitle");
  if (h) h.focus({ preventScroll: true });
}

window.addEventListener("hashchange", () => {
  S.ui.selected.clear();
  render();
  $(".main").scrollTo(0, 0);
  window.scrollTo(0, 0);
  closeDrawer();
  focusPageTitle();
});

$("#skipLink").addEventListener("click", (e) => {
  e.preventDefault();
  focusPageTitle();
});

/* ---------------- Theme ---------------- */

const THEME_KEY = "digian-theme";
const themeBtn = $("#themeToggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
}

themeBtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

// Light is the default. The theme only changes when the user presses the theme button;
// the early script in index.html restores their saved choice before the page paints.
applyTheme(document.documentElement.getAttribute("data-theme") || "light");

/* ---------------- Role switcher ---------------- */

const userBtn = $("#userBtn");
const roleMenu = $("#roleMenu");

function setMenu(open) {
  roleMenu.hidden = !open;
  userBtn.setAttribute("aria-expanded", String(open));
}

userBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  setMenu(roleMenu.hidden);
});

roleMenu.addEventListener("click", (e) => {
  const item = e.target.closest("[data-role]");
  if (!item) return;
  S.role = item.dataset.role;
  localStorage.setItem(ROLE_KEY, S.role);
  S.ui.selected.clear();
  S.ui.apprTab = "All";
  S.ui.expFilter = "All";
  setMenu(false);
  toast(`Switched to ${S.roles[S.role].label} view`);
  go("dashboard");
});

document.addEventListener("click", (e) => {
  if (!roleMenu.hidden && !e.target.closest(".user-menu")) setMenu(false);
});

/* ---------------- Toasts ---------------- */

// Optional `action` = { label, fn } adds a button (e.g. Undo) and keeps the toast up longer.
function toast(msg, tone, action) {
  const el = document.createElement("div");
  el.className = `toast ${tone || ""}`;
  el.innerHTML = `${icon(tone === "warn" ? "alert" : "checkCircle")}<span>${esc(msg)}</span>`;
  const remove = () => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 300);
  };
  if (action) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "toast-action";
    b.textContent = action.label;
    b.addEventListener("click", () => {
      remove();
      action.fn();
    });
    el.appendChild(b);
  }
  $("#toasts").appendChild(el);
  setTimeout(remove, action ? 6000 : 3000);
}

/* ---------------- Modal ---------------- */

const modalRoot = $("#modal");
let modalSubmit = null;
let lastFocus = null;

function openModal(title, body, submitLabel, onSubmit) {
  lastFocus = document.activeElement;
  modalSubmit = onSubmit;
  modalRoot.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <form id="modalForm" novalidate>
      <div class="modal-head"><h2 id="modalTitle">${title}</h2><button type="button" class="icon-btn sm" data-close aria-label="Close">${icon("x")}</button></div>
      <div class="modal-body">${body}</div>
      <div class="modal-foot" id="modalFoot">
        <button type="button" class="btn btn-light" data-close>Cancel</button>
        ${Array.isArray(submitLabel) ? submitLabel.map((s) => `<button type="submit" class="btn ${s.cls}" value="${s.value}">${s.label}</button>`).join("") : `<button type="submit" class="btn btn-primary">${submitLabel}</button>`}
      </div>
    </form>
  </div>`;
  modalRoot.hidden = false;
  const first = modalRoot.querySelector("input, select, textarea");
  if (first) first.focus();
}

// Keep Tab / Shift+Tab inside the open modal.
modalRoot.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const items = [...modalRoot.querySelectorAll("button, input, select, textarea, a[href]")].filter((x) => !x.disabled);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

function closeModal() {
  modalRoot.hidden = true;
  modalRoot.innerHTML = "";
  modalSubmit = null;
  if (lastFocus) lastFocus.focus();
}

modalRoot.addEventListener("click", (e) => {
  if (e.target === modalRoot || e.target.closest("[data-close]")) closeModal();
});

modalRoot.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!modalSubmit) return;
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  data._submitter = e.submitter ? e.submitter.value : "";
  form.querySelectorAll(".field-error").forEach((x) => x.remove());
  const errors = modalSubmit(data, form);
  if (errors && Object.keys(errors).length) {
    Object.entries(errors).forEach(([name, msg]) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (field) field.closest(".field").insertAdjacentHTML("beforeend", `<div class="field-error">${esc(msg)}</div>`);
    });
    return;
  }
  closeModal();
});

/* ---------------- Cross-role sync ---------------- */

// When an approver acts on an item, update the submitter's own record if it exists.
function syncStatus(id, status, note) {
  ["employee", "manager"].forEach((r) => {
    const e = S.expenses[r].find((x) => x.id === id);
    if (e) {
      e.status = status;
      if (note) e.note = note;
    }
    const ts = S.timesheets[r];
    if (ts.queueId === id) {
      ts.status = status;
      ts.note = note || "";
      if (status === "Approved") {
        const t = tsTotals(ts);
        ts.history.unshift({ period: ts.week.replace(/, \d{4}$/, ""), hours: t.total, billable: t.billable, status: "Approved", approver: S.roles[S.role].user.name });
      }
    }
  });
  const l = S.ledger.find((x) => x.id === id);
  if (l) l.status = status;
}

function submitToApprover(role, item) {
  const approver = S.roles[role].approver;
  if (!approver) return;
  const u = S.roles[role].user;
  S.approvals[approver].unshift(Object.assign({ name: u.name, tone: "blue", submitted: "Today" }, item));
}

function removeFromQueues(id) {
  Object.keys(S.approvals).forEach((r) => (S.approvals[r] = S.approvals[r].filter((a) => a.id !== id)));
}

function approve(ids) {
  const q = S.approvals[S.role];
  // Manager-approved expenses over $500 go on to finance when that rule is on.
  ids.forEach((id) => {
    const item = q.find((a) => a.id === id);
    if (!item) return;
    if (S.role === "manager" && (item.type === "Timesheet" || (S.settings.financeOver500 && item.amount > 500))) {
      S.approvals.admin.unshift(Object.assign({}, item, { submitted: "Today" }));
      syncStatus(id, "Submitted");
    } else {
      syncStatus(id, "Approved");
    }
    S.ui.selected.delete(id);
  });
  S.approvals[S.role] = q.filter((a) => !ids.includes(a.id));
}

// Copy of the data an approval can change, so it can be undone.
function snapshot() {
  return structuredClone({ approvals: S.approvals, expenses: S.expenses, timesheets: S.timesheets, ledger: S.ledger });
}

function undoAction(snap) {
  return {
    label: "Undo",
    fn() {
      Object.assign(S, snap);
      render();
      toast("Approval undone");
    }
  };
}

/* ---------------- Expense form ---------------- */

function expenseForm() {
  const projects = S.projects.map((p) => `<option value="${p.code}">${p.code} · ${esc(p.client)}</option>`).join("") + `<option value="INT-001">INT-001 · Internal</option>`;
  const cats = S.categories.map((c) => `<option>${c}</option>`).join("");
  return `<div class="form-grid">
    <div class="field"><label for="f-date">Date</label><input id="f-date" name="date" type="date" value="2026-11-16" max="2026-11-16" required></div>
    <div class="field"><label for="f-amount">Amount (USD)</label><input id="f-amount" name="amount" type="number" inputmode="decimal" min="0.01" step="0.01" placeholder="0.00" required></div>
    <div class="field span-2"><label for="f-merchant">Merchant</label><input id="f-merchant" name="merchant" type="text" maxlength="60" placeholder="e.g. Delta Air Lines" required></div>
    <div class="field"><label for="f-cat">Category</label><select id="f-cat" name="category">${cats}</select></div>
    <div class="field"><label for="f-proj">Project</label><select id="f-proj" name="project">${projects}</select></div>
    <div class="field span-2"><label for="f-receipt">Receipt</label><input id="f-receipt" name="receipt" type="file" accept="image/*,.pdf"></div>
    <div class="field span-2"><label for="f-notes">Notes <span class="muted-text">(optional)</span></label><textarea id="f-notes" name="notes" rows="2" maxlength="200" placeholder="Business purpose, attendees…"></textarea></div>
  </div>`;
}

function validateExpense(d) {
  const err = {};
  const amount = parseFloat(d.amount);
  if (!d.merchant || !d.merchant.trim()) err.merchant = "Enter the merchant name.";
  if (!(amount > 0)) err.amount = "Enter an amount greater than 0.";
  else if (amount > 10000) err.amount = "Amounts over $10,000 must go through procurement.";
  if (!d.date) err.date = "Pick a date.";
  if (d._submitter === "submit" && S.settings.receiptOver25 && amount > 25 && !(d.receipt && d.receipt.name)) err.receipt = "A receipt is required for expenses over $25.";
  return err;
}

function newExpense() {
  const buttons = S.role === "admin"
    ? [{ label: "Add expense", cls: "btn-primary", value: "submit" }]
    : [{ label: "Save draft", cls: "btn-light", value: "draft" }, { label: "Submit", cls: "btn-primary", value: "submit" }];

  openModal("New expense", expenseForm(), buttons, (d) => {
    const err = validateExpense(d);
    if (Object.keys(err).length) return err;
    const dt = new Date(d.date + "T00:00:00");
    const exp = {
      id: `EXP-${nextExpenseId++}`,
      date: dt.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
      merchant: d.merchant.trim(),
      category: d.category,
      project: d.project,
      amount: Math.round(parseFloat(d.amount) * 100) / 100,
      receipt: !!(d.receipt && d.receipt.name),
      status: d._submitter === "submit" ? "Submitted" : "Draft"
    };

    if (S.role === "admin") {
      S.ledger.unshift({ id: exp.id, date: exp.date, name: S.roles.admin.user.name, merchant: exp.merchant, category: exp.category, amount: exp.amount, flag: exp.receipt ? "" : "Missing receipt", status: "Approved" });
      toast(`${exp.id} added to the expense ledger`);
      go("expenses");
      return;
    }

    S.expenses[S.role].unshift(exp);
    if (exp.status === "Submitted") {
      submitToApprover(S.role, { id: exp.id, type: "Expense", detail: `${exp.merchant} · ${exp.category}`, amount: exp.amount, flag: exp.receipt ? "" : "Missing receipt" });
      toast(`${exp.id} submitted for approval`);
    } else {
      toast(`${exp.id} saved as draft`);
    }
    S.ui.expFilter = "All";
    go("expenses");
  });
}

/* ---------------- Timesheet helpers ---------------- */

function myTimesheet() {
  return S.timesheets[S.role];
}

function refreshTsTotals() {
  const ts = myTimesheet();
  ts.rows.forEach((r, i) => {
    const el = view.querySelector(`[data-row-total="${i}"]`);
    if (el) el.textContent = hrs(sum(r.hours));
  });
  ts.days.forEach((_, d) => {
    const el = view.querySelector(`[data-day-total="${d}"]`);
    if (el) el.textContent = hrs(sum(ts.rows, (r) => r.hours[d]));
  });
  const g = view.querySelector("[data-grand-total]");
  if (g) g.textContent = hrs(tsTotals(ts).total);
  const s = $("#tsSummary");
  if (s) s.innerHTML = tsSummary(ts);
}

view.addEventListener("input", (e) => {
  const inp = e.target.closest(".ts-input");
  if (!inp) return;
  let v = parseFloat(inp.value);
  if (isNaN(v) || v < 0) v = 0;
  if (v > 24) {
    v = 24;
    inp.value = 24;
  }
  myTimesheet().rows[+inp.dataset.row].hours[+inp.dataset.day] = v;
  refreshTsTotals();
});

function addTimesheetLine() {
  const projects = S.projects.map((p) => `<option value="${p.code}">${p.code} · ${esc(p.client)} — ${esc(p.name)}</option>`).join("") + `<option value="INT-001">INT-001 · Internal</option>`;
  openModal(
    "Add line",
    `<div class="form-grid">
      <div class="field span-2"><label for="f-p">Project</label><select id="f-p" name="project">${projects}</select></div>
      <div class="field span-2"><label for="f-t">Task</label><input id="f-t" name="task" type="text" maxlength="50" placeholder="e.g. Workshop facilitation" required></div>
      <label class="check-row span-2"><input type="checkbox" name="billable" checked class="chk"> Billable to client</label>
    </div>`,
    "Add line",
    (d) => {
      if (!d.task || !d.task.trim()) return { task: "Describe the task." };
      const p = S.projects.find((x) => x.code === d.project);
      myTimesheet().rows.push({
        project: p ? `${p.client} — ${p.name}` : "Internal",
        code: d.project,
        task: d.task.trim(),
        billable: d.project !== "INT-001" && !!d.billable,
        hours: [0, 0, 0, 0, 0, 0, 0]
      });
      render();
    }
  );
}

/* ---------------- CSV export ---------------- */

function downloadCSV(name, rows) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast(`Downloaded ${name}`);
}

function exportKind(kind) {
  const map = {
    team: () => ["team-utilization.csv", [["Member", "Title", "Hours", "Billable", "Utilization %", "Status"], ...S.team.map((m) => [m.name, m.title, m.hours, m.billable, pct(m.billable, m.hours).toFixed(1), m.status])]],
    projects: () => ["project-burn.csv", [["Code", "Project", "Client", "Billing", "Budget h", "Used h", "Status"], ...S.projects.map((p) => [p.code, p.name, p.client, p.type, p.budget, p.used, projectStatus(p)])]],
    approvals: () => ["approval-queue.csv", [["ID", "Type", "Submitted by", "Details", "Hours", "Amount", "Flag"], ...S.approvals[S.role].map((a) => [a.id, a.type, a.name, a.detail, a.hours || "", a.amount || "", a.flag || ""])]],
    ledger: () => ["expense-ledger.csv", [["ID", "Date", "Employee", "Merchant", "Category", "Amount", "Policy", "Status"], ...S.ledger.map((e) => [e.id, e.date, e.name, e.merchant, e.category, e.amount.toFixed(2), e.flag || "OK", e.status])]],
    invoices: () => ["invoice-register.csv", [["Invoice", "Client", "Project", "Basis", "Amount", "Due", "Status"], ...S.invoices.map((i) => [i.id, i.client, i.project, i.basis, i.amount.toFixed(2), i.due, i.status])]],
    "org-timesheets": () => ["timesheet-compliance.csv", [["Team", "Manager", "Headcount", "Submitted", "Approved", "Hours"], ...S.orgTimesheets.map((t) => [t.team, t.manager, t.headcount, t.submitted, t.approved, t.hours])]],
    summary: () => ["executive-summary.csv", [["Metric", "Value"], ["Billable utilization", orgStats().util.toFixed(1) + "%"], ["Pending approvals", S.approvals.admin.length], ["Ready to invoice", sum(readyInvoices(), (i) => i.amount).toFixed(2)], ["Expense disbursements", sum(S.payout.lines, (l) => l.amount).toFixed(2)]]]
  };
  const [name, rows] = (map[kind] || map.summary)();
  downloadCSV(name, rows);
}

/* ---------------- Actions ---------------- */

const ACTIONS = {
  tab(el) {
    S.ui[el.dataset.key] = el.dataset.value;
    S.ui.selected.clear();
    render();
  },
  approve(el) {
    const item = S.approvals[S.role].find((a) => a.id === el.dataset.id);
    const snap = snapshot();
    approve([el.dataset.id]);
    render();
    if (item) toast(`Approved ${item.type.toLowerCase()} from ${item.name}`, "", undoAction(snap));
  },
  "approve-selected"() {
    const ids = [...S.ui.selected];
    const snap = snapshot();
    approve(ids);
    render();
    toast(`Approved ${ids.length} item${ids.length === 1 ? "" : "s"}`, "", undoAction(snap));
  },
  reject(el) {
    const item = S.approvals[S.role].find((a) => a.id === el.dataset.id);
    if (!item) return;
    openModal(
      `Reject ${item.type.toLowerCase()}`,
      `<p class="modal-text">${esc(item.name)} · ${esc(item.detail)} · <strong>${approvalValue(item)}</strong></p>
       <div class="field"><label for="f-reason">Reason</label><textarea id="f-reason" name="reason" rows="3" maxlength="200" placeholder="Tell ${esc(item.name.split(" ")[0])} what needs to change" required></textarea></div>`,
      [{ label: "Reject", cls: "btn-danger", value: "reject" }],
      (d) => {
        if (!d.reason || !d.reason.trim()) return { reason: "Add a reason so the submitter knows what to fix." };
        S.approvals[S.role] = S.approvals[S.role].filter((a) => a.id !== item.id);
        S.ui.selected.delete(item.id);
        syncStatus(item.id, "Rejected", d.reason.trim());
        render();
        toast(`Returned to ${item.name}`, "warn");
      }
    );
  },
  select(el) {
    el.checked ? S.ui.selected.add(el.dataset.id) : S.ui.selected.delete(el.dataset.id);
    render();
  },
  "select-all"(el) {
    const q = S.approvals[S.role];
    const shown = S.ui.apprTab === "All" ? q : q.filter((a) => a.type + "s" === S.ui.apprTab);
    shown.forEach((a) => (el.checked ? S.ui.selected.add(a.id) : S.ui.selected.delete(a.id)));
    render();
  },
  "exp-new": newExpense,
  "exp-submit"(el) {
    const e = S.expenses[S.role].find((x) => x.id === el.dataset.id);
    if (!e) return;
    if (S.settings.receiptOver25 && e.amount > 25 && !e.receipt) {
      toast("Attach a receipt before submitting (required over $25)", "warn");
      return;
    }
    e.status = "Submitted";
    submitToApprover(S.role, { id: e.id, type: "Expense", detail: `${e.merchant} · ${e.category}`, amount: e.amount });
    render();
    toast(`${e.id} submitted for approval`);
  },
  "exp-delete"(el) {
    S.expenses[S.role] = S.expenses[S.role].filter((x) => x.id !== el.dataset.id);
    render();
    toast("Draft deleted");
  },
  "ts-add": addTimesheetLine,
  "ts-remove"(el) {
    myTimesheet().rows.splice(+el.dataset.row, 1);
    render();
  },
  "ts-save"() {
    toast("Draft saved");
  },
  "ts-submit"() {
    const ts = myTimesheet();
    const t = tsTotals(ts);
    if (t.total <= 0) {
      toast("Log some hours before submitting", "warn");
      return;
    }
    ts.status = "Submitted";
    ts.note = "";
    ts.queueId = `TS-${Math.floor(900 + Math.random() * 99)}`;
    submitToApprover(S.role, { id: ts.queueId, type: "Timesheet", detail: ts.week.replace(/, \d{4}$/, ""), hours: t.total, flag: t.total > 40 ? `Overtime ${hrs(t.total - 40)}h` : "" });
    render();
    toast(`Timesheet submitted · ${hrs(t.total)}h`);
  },
  "ts-recall"() {
    const ts = myTimesheet();
    if (ts.status !== "Submitted") {
      toast(`This timesheet is ${ts.status.toLowerCase()} and can't be recalled`, "warn");
      return;
    }
    removeFromQueues(ts.queueId);
    ts.status = "Draft";
    render();
    toast("Timesheet recalled to draft");
  },
  remind(el) {
    S.ui.reminded.add(el.dataset.name);
    render();
    toast(`Reminder sent to ${el.dataset.name}`);
  },
  "remind-all"() {
    const names = S.missing.map((m) => m.name).filter((n) => !S.ui.reminded.has(n));
    names.forEach((n) => S.ui.reminded.add(n));
    render();
    toast(`Reminders sent to ${names.length} people`);
  },
  "send-invoice"(el) {
    const inv = S.invoices.find((i) => i.id === el.dataset.id);
    inv.status = "Sent";
    inv.due = "Dec 16";
    render();
    toast(`${inv.id} sent to ${inv.client}`);
  },
  "send-all-invoices"() {
    const r = readyInvoices();
    r.forEach((i) => {
      i.status = "Sent";
      i.due = "Dec 16";
    });
    render();
    toast(`${r.length} invoices sent`);
  },
  "remind-invoice"(el) {
    toast(`Payment reminder sent for ${el.dataset.id}`);
  },
  "release-batch"() {
    S.payout.status = "Processing";
    render();
    toast(`${S.payout.id} released to ADP`);
  },
  sync(el) {
    toast(`${el.dataset.name} sync started`);
  },
  connect(el) {
    const x = S.integrations.find((i) => i.name === el.dataset.name);
    x.status = "Connected";
    x.meta = "Connected just now";
    render();
    toast(`${x.name} connected`);
  },
  export(el) {
    exportKind(el.dataset.kind);
  }
};

view.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.action];
  if (!fn) return;
  if (el.tagName === "A" || el.tagName === "BUTTON") e.preventDefault();
  fn(el);
});

view.addEventListener("change", (e) => {
  const s = e.target.closest("[data-setting]");
  if (!s) return;
  S.settings[s.dataset.setting] = s.checked;
  toast("Setting saved");
});

/* ---------------- Sidebar open / close ---------------- */

const toggleBtn = $("#sidebarToggle");

function updateAria() {
  const expanded = mobile.matches ? app.classList.contains("sidebar-open") : !app.classList.contains("sidebar-collapsed");
  toggleBtn.setAttribute("aria-expanded", String(expanded));
}

function closeDrawer() {
  app.classList.remove("sidebar-open");
  document.body.style.overflow = "";
  updateAria();
}

toggleBtn.addEventListener("click", () => {
  if (mobile.matches) {
    const open = app.classList.toggle("sidebar-open");
    document.body.style.overflow = open ? "hidden" : "";
  } else {
    localStorage.setItem(COLLAPSE_KEY, app.classList.toggle("sidebar-collapsed") ? "1" : "0");
  }
  updateAria();
});

$("#sidebarClose").addEventListener("click", closeDrawer);
$("#overlay").addEventListener("click", closeDrawer);
mobile.addEventListener("change", closeDrawer);

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!modalRoot.hidden) closeModal();
  else if (!roleMenu.hidden) setMenu(false);
  else closeDrawer();
});

const savedCollapse = localStorage.getItem(COLLAPSE_KEY);
if (savedCollapse === "1" || (savedCollapse === null && window.innerWidth < 1200)) app.classList.add("sidebar-collapsed");

/* ---------------- Start ---------------- */

render();
updateAria();
