/* UI helpers and page views. Each view returns HTML for the main content area. */

const ICONS = {
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  approvals: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 10 2 2 3-3M7 16h3M14 10h3M14 16h3"/>',
  reports: '<path d="M3 17l5-6 4 3 4-6"/><circle cx="17" cy="16" r="3"/><path d="m19.5 18.5 2 2"/>',
  settings: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.2.6 3.5 2.8 3.5 6"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2M6 6V5a1 1 0 0 1 1-1h10"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  paperclip: '<path d="m21 11-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  file: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M9 17h4"/>',
  plug: '<path d="M9 7V3M15 7V3M6 7h12v4a6 6 0 0 1-12 0zM12 17v4"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>'
};

function icon(name, cls) {
  return `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const money = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money0 = (n) => "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
const hrs = (n) => (Math.round(n * 10) / 10).toFixed(1);
const sum = (arr, fn) => arr.reduce((t, x) => t + (fn ? fn(x) : x), 0);
const pct = (a, b) => (b ? (a / b) * 100 : 0);
const initials = (name) => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const STATUS_TONE = {
  Draft: "gray", Submitted: "blue", Pending: "blue", Approved: "mint", Paid: "mint", Rejected: "red",
  Scheduled: "blue", Processing: "amber", Ready: "blue", Sent: "gray", Overdue: "red",
  "On track": "mint", "At risk": "amber", Critical: "red", "Not submitted": "red",
  Connected: "mint", "Not connected": "gray", Timesheet: "blue", Expense: "mint", Active: "mint"
};

function pill(text, tone) {
  return `<span class="pill pill-${tone || STATUS_TONE[text] || "gray"}">${esc(text)}</span>`;
}

function btn(label, opts) {
  const o = opts || {};
  const attrs = o.action ? `data-action="${o.action}"` : "";
  const extra = o.attrs || "";
  return `<button class="btn ${o.cls || "btn-light"}" ${attrs} ${extra} ${o.disabled ? "disabled" : ""}>${o.icon ? icon(o.icon) : ""}${label}</button>`;
}

function avatar(name, tone) {
  return `<div class="so-avatar ${tone || "blue"}">${esc(initials(name))}</div>`;
}

function kpi(label, value, sub, subCls) {
  return `<div class="card kpi"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div><div class="kpi-sub ${subCls || ""}">${sub}</div></div>`;
}

function progress(value, tone) {
  const w = Math.max(0, Math.min(100, value));
  return `<div class="progress"><div class="progress-fill ${tone || ""}" style="width:${w}%"></div></div>`;
}

function barRows(items) {
  return `<div class="bars">${items
    .map((i) => `<div class="bar-row"><span class="day">${esc(i.label)}</span><div class="track"><div class="fill" style="width:${Math.min(100, i.pct)}%"></div></div><span class="hrs">${i.value}</span></div>`)
    .join("")}</div>`;
}

function table(head, rows, opts) {
  const o = opts || {};
  if (!rows.length) return emptyState(o.empty || "Nothing here yet.");
  return `<div class="table-wrap"><table class="table ${o.cls || ""}">
    <thead><tr>${head.map((h) => `<th class="${h.cls || ""}">${h.label}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="${head[i].cls || ""}">${c}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}

function cell(title, sub) {
  return `<div class="cell-title">${title}</div>${sub ? `<div class="cell-sub">${sub}</div>` : ""}`;
}

function person(name, tone, sub) {
  return `<div class="person">${avatar(name, tone)}<div>${cell(esc(name), sub)}</div></div>`;
}

function emptyState(text) {
  return `<div class="empty">${icon("checkCircle")}<p>${text}</p></div>`;
}

function tabs(key, items) {
  return `<div class="tabs" role="tablist">${items
    .map((t) => `<button class="tab ${S.ui[key] === t.label ? "active" : ""}" role="tab" data-action="tab" data-key="${key}" data-value="${esc(t.label)}">${esc(t.label)}${t.count != null ? `<span class="tab-count">${t.count}</span>` : ""}</button>`)
    .join("")}</div>`;
}

function cardHead(title, sub, right) {
  return `<div class="card-head"><div><h2>${title}</h2>${sub ? `<p class="muted">${sub}</p>` : ""}</div>${right || ""}</div>`;
}

function pageHead(title, subtitle, actions) {
  return `<div class="page-head">
    <div>
      <h1>${title}</h1>
      <p class="subtitle">${subtitle}</p>
    </div>
    <div class="actions">${actions || ""}</div>
  </div>`;
}

function approvalValue(a) {
  return a.type === "Timesheet" ? `${hrs(a.hours)} hrs` : money(a.amount);
}

// Dashboard preview of the approval queue. Items link to the Approvals page,
// where flags and details are visible before anything is approved.
function signoffItem(a) {
  return `<a class="so-item task" href="#/approvals">
    ${avatar(a.name, a.tone)}
    <div class="so-info"><div class="so-name">${esc(a.name)}</div><div class="so-meta">${approvalValue(a)}${a.flag ? ` · <span class="text-amber">${esc(a.flag)}</span>` : ""}</div></div>
    <span class="tag ${a.type === "Timesheet" ? "tag-blue" : "tag-mint"}">${a.type}</span>
  </a>`;
}

function signoffCard(title, queue, limit) {
  const list = queue.slice(0, limit);
  const flagged = queue.filter((a) => a.flag).length;
  return `<div class="card signoff">
    <div class="card-head center">
      <h2>${title} <span class="count">${queue.length}</span></h2>
    </div>
    <div class="signoff-list">${list.length ? list.map(signoffItem).join("") : emptyState("All caught up. No items waiting for you.")}</div>
    <div class="card-foot signoff-foot">
      <span class="muted">${queue.length} waiting${flagged ? ` · ${flagged} flagged` : ""}</span>
      ${queue.length ? `<a href="#/approvals" class="link">Review all ${icon("chevronRight")}</a>` : ""}
    </div>
  </div>`;
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function tsTotals(ts) {
  const total = sum(ts.rows, (r) => sum(r.hours));
  const billable = sum(ts.rows.filter((r) => r.billable), (r) => sum(r.hours));
  return { total, billable, internal: total - billable };
}

/* ------------------------------------------------------------------ */
/* Shared views (used by more than one role)                           */
/* ------------------------------------------------------------------ */

function viewMyTimesheets(role) {
  const ts = S.timesheets[role];
  const locked = !["Draft", "Rejected"].includes(ts.status);
  const t = tsTotals(ts);

  const rows = ts.rows
    .map((r, i) => `<tr>
      <td class="ts-proj">${cell(esc(r.project), `${esc(r.code)} · ${esc(r.task)}${r.billable ? "" : " · Non-billable"}`)}</td>
      ${r.hours
        .map((h, d) => `<td class="ts-cell ${d > 4 ? "wknd" : ""}"><input class="ts-input" type="number" inputmode="decimal" min="0" max="24" step="0.5" value="${h || ""}" placeholder="0" data-row="${i}" data-day="${d}" aria-label="${esc(r.code)} ${ts.days[d]}" ${locked ? "disabled" : ""}></td>`)
        .join("")}
      <td class="num strong" data-row-total="${i}">${hrs(sum(r.hours))}</td>
      <td class="ts-act">${locked ? "" : `<button class="icon-btn sm" data-action="ts-remove" data-row="${i}" aria-label="Remove line">${icon("trash")}</button>`}</td>
    </tr>`)
    .join("");

  const foot = `<tr>
    <td class="strong">Daily total</td>
    ${ts.days.map((_, d) => `<td class="num strong" data-day-total="${d}">${hrs(sum(ts.rows, (r) => r.hours[d]))}</td>`).join("")}
    <td class="num strong" data-grand-total>${hrs(t.total)}</td><td></td>
  </tr>`;

  const actions = locked
    ? btn("Recall", { icon: "undo", action: "ts-recall" })
    : btn("Add line", { icon: "plus", action: "ts-add" }) + btn("Save draft", { action: "ts-save" }) + btn("Submit for approval", { icon: "send", cls: "btn-primary", action: "ts-submit" });

  const history = table(
    [{ label: "Period" }, { label: "Total", cls: "num" }, { label: "Billable", cls: "num" }, { label: "Approver" }, { label: "Status" }],
    ts.history.map((h) => [cell(h.period), hrs(h.hours), hrs(h.billable), esc(h.approver), pill(h.status)])
  );

  return `
    ${pageHead("Timesheets", "Log hours against projects each day and submit your week for approval.", actions)}
    <div class="kpis" id="tsSummary">${tsSummary(ts)}</div>
    <div class="card card-pad">
      ${cardHead(`Week of ${ts.week}`, `Due Fri, Nov 20 at 5:00 PM · ${S.roles[role].approver === "admin" ? "Approver: Sarah Jenkins" : "Approver: Priya Shah"}`, `<div class="head-right">${pill(ts.status)}<div class="date-chip">${icon("calendar")}${ts.week}</div></div>`)}
      <div class="divider"></div>
      ${ts.rows.length ? `<div class="table-wrap"><table class="table ts-table">
        <thead><tr><th>Project / Task</th>${ts.days.map((d, i) => `<th class="num ${i > 4 ? "wknd" : ""}">${d}</th>`).join("")}<th class="num">Total</th><th></th></tr></thead>
        <tbody>${rows}</tbody><tfoot>${foot}</tfoot></table></div>` : emptyState("No lines yet. Use “Add line” to start logging time.")}
      ${ts.note ? `<div class="notice notice-red">${icon("alert")}Returned by approver: ${esc(ts.note)}</div>` : ""}
    </div>
    <div class="card card-pad">
      ${cardHead("Previous weeks", "Submitted timesheets and their approval status")}
      <div class="divider"></div>
      ${history}
    </div>`;
}

function tsSummary(ts) {
  const t = tsTotals(ts);
  return (
    kpi("LOGGED THIS WEEK", `${hrs(t.total)}h`, `Target 40.0h · ${hrs(Math.max(0, 40 - t.total))}h remaining`) +
    kpi("BILLABLE", `${hrs(t.billable)}h`, `${pct(t.billable, t.total).toFixed(1)}% of logged time`, "teal") +
    kpi("NON-BILLABLE", `${hrs(t.internal)}h`, "Internal, training and admin") +
    kpi("STATUS", ts.status, ts.status === "Draft" ? "Not yet submitted" : ts.status === "Submitted" ? "Waiting for approver" : ts.status === "Rejected" ? "Changes requested" : "Locked")
  );
}

function viewMyExpenses(role) {
  const list = S.expenses[role];
  const f = S.ui.expFilter;
  const filters = ["All", "Draft", "Submitted", "Approved", "Paid", "Rejected"];
  const shown = f === "All" ? list : list.filter((e) => e.status === f);
  const pending = list.filter((e) => e.status === "Submitted");
  const approved = list.filter((e) => e.status === "Approved");
  const missing = list.filter((e) => !e.receipt && e.status !== "Rejected");

  const rows = shown.map((e) => [
    cell(e.date),
    cell(esc(e.merchant), `${e.id}${e.note ? ` · <span class="text-red">${esc(e.note)}</span>` : ""}`),
    esc(e.category),
    esc(e.project),
    `<span class="${e.receipt ? "text-teal" : "text-amber"}" title="${e.receipt ? "Receipt attached" : "Receipt missing"}">${icon(e.receipt ? "paperclip" : "alert", "ic-sm")}</span>`,
    `<span class="strong">${money(e.amount)}</span>`,
    pill(e.status),
    e.status === "Draft"
      ? `<div class="row-actions"><button class="btn btn-sm btn-light" data-action="exp-submit" data-id="${e.id}">Submit</button><button class="icon-btn sm" data-action="exp-delete" data-id="${e.id}" aria-label="Delete">${icon("trash")}</button></div>`
      : ""
  ]);

  return `
    ${pageHead("Expenses", "Capture receipts, code them to a project and submit for reimbursement.", btn("New expense", { icon: "plus", cls: "btn-primary", action: "exp-new" }))}
    <div class="kpis">
      ${kpi("AWAITING APPROVAL", money(sum(pending, (e) => e.amount)), `${pending.length} submitted ${pending.length === 1 ? "item" : "items"}`)}
      ${kpi("APPROVED, NOT PAID", money(sum(approved, (e) => e.amount)), "Included in the next payout")}
      ${kpi("DRAFTS", String(list.filter((e) => e.status === "Draft").length), "Not yet submitted")}
      ${kpi("MISSING RECEIPTS", String(missing.length), missing.length ? "Attach before submitting" : "All receipts attached", missing.length ? "text-amber" : "teal")}
    </div>
    <div class="card card-pad">
      <div class="card-head wrap">${tabs("expFilter", filters.map((l) => ({ label: l, count: l === "All" ? list.length : list.filter((e) => e.status === l).length })))}</div>
      <div class="divider"></div>
      ${table(
        [{ label: "Date" }, { label: "Merchant" }, { label: "Category" }, { label: "Project" }, { label: "Receipt" }, { label: "Amount", cls: "num" }, { label: "Status" }, { label: "", cls: "right" }],
        rows,
        { empty: `No ${f === "All" ? "" : f.toLowerCase() + " "}expenses.` }
      )}
    </div>`;
}

function viewApprovals(role) {
  const q = S.approvals[role];
  const tab = S.ui.apprTab;
  const shown = tab === "All" ? q : q.filter((a) => a.type + "s" === tab);
  const selected = shown.filter((a) => S.ui.selected.has(a.id));
  const allChecked = shown.length && selected.length === shown.length;

  const rows = shown.map((a) => [
    `<input type="checkbox" class="chk" data-action="select" data-id="${a.id}" ${S.ui.selected.has(a.id) ? "checked" : ""} aria-label="Select ${esc(a.name)}">`,
    person(a.name, a.tone, a.id),
    pill(a.type),
    cell(esc(a.detail), `Submitted ${esc(a.submitted)}`),
    `<span class="strong">${approvalValue(a)}</span>`,
    a.flag ? `<span class="flag">${icon("alert", "ic-sm")}${esc(a.flag)}</span>` : `<span class="muted-text">—</span>`,
    `<div class="row-actions"><button class="btn btn-sm btn-light" data-action="reject" data-id="${a.id}">Reject</button><button class="btn btn-sm btn-primary" data-action="approve" data-id="${a.id}">Approve</button></div>`
  ]);

  const subtitle = role === "admin"
    ? "Final finance review for manager-approved items before billing and payout."
    : "Review timesheets and expenses submitted by your team.";

  return `
    ${pageHead("Approvals", subtitle, btn(`Approve selected (${selected.length})`, { icon: "check", cls: "btn-primary", action: "approve-selected", disabled: !selected.length }))}
    <div class="kpis">
      ${kpi("WAITING", String(q.length), `${q.filter((a) => a.type === "Timesheet").length} Timesheets · ${q.filter((a) => a.type === "Expense").length} Expenses`)}
      ${kpi("HOURS TO REVIEW", `${hrs(sum(q.filter((a) => a.type === "Timesheet"), (a) => a.hours))}h`, "Across submitted timesheets")}
      ${kpi("SPEND TO REVIEW", money(sum(q.filter((a) => a.type === "Expense"), (a) => a.amount)), "Across submitted expenses")}
      ${kpi("FLAGGED", String(q.filter((a) => a.flag).length), "Policy or timing exceptions", q.some((a) => a.flag) ? "text-amber" : "teal")}
    </div>
    <div class="card card-pad">
      <div class="card-head wrap">
        ${tabs("apprTab", [
          { label: "All", count: q.length },
          { label: "Timesheets", count: q.filter((a) => a.type === "Timesheet").length },
          { label: "Expenses", count: q.filter((a) => a.type === "Expense").length }
        ])}
        ${shown.length ? `<label class="check-all"><input type="checkbox" class="chk" data-action="select-all" ${allChecked ? "checked" : ""}> Select all</label>` : ""}
      </div>
      <div class="divider"></div>
      ${table(
        [{ label: "", cls: "w-chk" }, { label: "Submitted by" }, { label: "Type" }, { label: "Details" }, { label: "Amount", cls: "num" }, { label: "Flags" }, { label: "", cls: "right" }],
        rows,
        { empty: "All caught up. Nothing is waiting for your approval." }
      )}
    </div>`;
}

/* ------------------------------------------------------------------ */
/* Employee                                                            */
/* ------------------------------------------------------------------ */

function viewEmployeeDashboard() {
  const ts = S.timesheets.employee;
  const t = tsTotals(ts);
  const ex = S.expenses.employee;
  const submitted = ex.filter((e) => e.status === "Submitted");
  const approved = ex.filter((e) => e.status === "Approved");
  const drafts = ex.filter((e) => e.status === "Draft");
  const noReceipt = ex.filter((e) => !e.receipt && e.status !== "Rejected");

  const days = ts.days.slice(0, 5).map((d, i) => {
    const v = sum(ts.rows, (r) => r.hours[i]);
    return { label: d.slice(0, 3), pct: pct(v, 8), value: `${hrs(v)}h` };
  });

  const tasks = [];
  if (ts.status === "Draft" || ts.status === "Rejected") tasks.push({ ic: "clock", title: `Submit timesheet for ${ts.week.replace(/, \d{4}$/, "")}`, sub: `${hrs(t.total)}h logged · due Fri, Nov 20`, href: "#/timesheets", cta: "Open" });
  noReceipt.forEach((e) => tasks.push({ ic: "paperclip", title: `Attach receipt: ${e.merchant}`, sub: `${money(e.amount)} · ${e.date}`, href: "#/expenses", cta: "Fix" }));
  drafts.filter((e) => e.receipt).forEach((e) => tasks.push({ ic: "receipt", title: `Submit draft: ${e.merchant}`, sub: money(e.amount), href: "#/expenses", cta: "Open" }));

  return `
    ${pageHead(`${greeting()}, ${S.roles.employee.user.name.split(" ")[0]}`, "Your hours, expenses and reimbursements for this week.", btn("New expense", { icon: "plus", action: "exp-new" }) + `<a class="btn btn-primary" href="#/timesheets">${icon("clock")}Log time</a>`)}
    <div class="kpis">
      ${kpi("HOURS THIS WEEK", `${hrs(t.total)}h`, `Target 40.0h · Due Fri, Nov 20`)}
      ${kpi("BILLABLE UTILIZATION", `${pct(t.billable, t.total).toFixed(1)}%`, "Target 85%", "teal")}
      ${kpi("AWAITING APPROVAL", money(sum(submitted, (e) => e.amount)), `${submitted.length} expense${submitted.length === 1 ? "" : "s"} with Priya Shah`)}
      ${kpi("NEXT REIMBURSEMENT", money(sum(approved, (e) => e.amount)), "ACH ••4821 · Nov 20")}
    </div>
    <div class="mid">
      <div class="card hours">
        ${cardHead("This Week", "Hours logged per day against an 8h day", `<div class="date-chip">${icon("calendar")}Nov 16 - Nov 22</div>`)}
        <div class="divider"></div>
        <div class="legend"><span><i class="lg dark"></i>Logged (${hrs(t.total)}h)</span><span><i class="lg light"></i>Remaining (${hrs(Math.max(0, 40 - t.total))}h)</span></div>
        ${barRows(days)}
        <div class="divider"></div>
        <div class="card-foot"><span>Billable: ${hrs(t.billable)} hrs</span><span>Non-billable: ${hrs(t.internal)} hrs</span></div>
      </div>
      <div class="card signoff">
        <div class="card-head center"><h2>To Do <span class="count">${tasks.length}</span></h2></div>
        <div class="signoff-list">
          ${tasks.length ? tasks.map((k) => `<a class="so-item task" href="${k.href}"><div class="task-ic">${icon(k.ic)}</div><div class="so-info"><div class="so-name">${esc(k.title)}</div><div class="so-meta">${k.sub}</div></div><span class="link">${k.cta} ${icon("chevronRight")}</span></a>`).join("") : emptyState("You're all set for this week.")}
        </div>
        <div class="card-foot signoff-foot"><span class="muted">Approver: Priya Shah</span><a href="#/expenses" class="link">All expenses ${icon("chevronRight")}</a></div>
      </div>
    </div>
    <div class="card timeline">
      ${cardHead("Recent Expenses", "Your latest receipts and their status", `<a href="#/expenses" class="link">View All ${icon("chevronRight")}</a>`)}
      <div class="tl-grid">${ex
        .slice(0, 3)
        .map((e) => `<a class="tl-item" href="#/expenses">
          <div class="tl-top"><span>${esc(e.date.toUpperCase())}, 2026</span>${pill(e.status)}</div>
          <div class="tl-title">${esc(e.merchant)}</div>
          <div class="tl-sub">${esc(e.category)} · ${money(e.amount)}</div>
        </a>`)
        .join("")}</div>
    </div>`;
}

function viewEmployeeReimbursements() {
  const ex = S.expenses.employee;
  const approved = ex.filter((e) => e.status === "Approved");
  const submitted = ex.filter((e) => e.status === "Submitted");
  const paidYtd = sum(S.myPayouts.filter((p) => p.status === "Paid"), (p) => p.amount) + 6022.5;

  return `
    ${pageHead("Reimbursements", "Track when approved expenses are paid back to your bank account.")}
    <div class="kpis">
      ${kpi("NEXT PAYOUT", money(sum(approved, (e) => e.amount)), `Nov 20, 2026 · ${approved.length} item${approved.length === 1 ? "" : "s"}`)}
      ${kpi("AWAITING APPROVAL", money(sum(submitted, (e) => e.amount)), "Paid after approval")}
      ${kpi("PAID THIS YEAR", money(paidYtd), "Jan 01 – Nov 16, 2026")}
      ${kpi("PAYMENT METHOD", "ACH ••4821", "Chase Checking · Verified", "teal")}
    </div>
    <div class="grid-2">
      <div class="card card-pad">
        ${cardHead("In the next payout", "Approved expenses scheduled for Nov 20")}
        <div class="divider"></div>
        ${table(
          [{ label: "Merchant" }, { label: "Category" }, { label: "Amount", cls: "num" }],
          approved.map((e) => [cell(esc(e.merchant), `${e.id} · ${e.date}`), esc(e.category), `<span class="strong">${money(e.amount)}</span>`]),
          { empty: "No approved expenses waiting for payout." }
        )}
      </div>
      <div class="card card-pad">
        ${cardHead("Payout history", "Deposits made to your account")}
        <div class="divider"></div>
        ${table(
          [{ label: "Payout" }, { label: "Items", cls: "num" }, { label: "Amount", cls: "num" }, { label: "Status" }],
          S.myPayouts.map((p) => [cell(p.id, `${p.date} · ${p.method}`), p.items, `<span class="strong">${money(p.amount)}</span>`, pill(p.status)])
        )}
      </div>
    </div>`;
}

/* ------------------------------------------------------------------ */
/* Manager                                                             */
/* ------------------------------------------------------------------ */

function projectStatus(p) {
  const u = pct(p.used, p.budget);
  return u >= 95 ? "Critical" : u >= 85 ? "At risk" : "On track";
}

function teamStats() {
  const h = sum(S.team, (m) => m.hours);
  const b = sum(S.team, (m) => m.billable);
  return { hours: h, billable: b, util: pct(b, h), target: S.team.length * 40 };
}

function viewManagerDashboard() {
  const q = S.approvals.manager;
  const t = teamStats();
  const risky = S.projects.filter((p) => projectStatus(p) !== "On track");

  return `
    ${pageHead("Team Overview", "Utilization, approvals and project budgets for Advisory — East.", `<a class="btn btn-primary" href="#/approvals">${icon("approvals")}Review approvals</a>`)}
    <div class="kpis">
      ${kpi("TEAM UTILIZATION", `${t.util.toFixed(1)}%`, "Target 80% · Nov 09 – Nov 15", "teal")}
      ${kpi("PENDING APPROVALS", String(q.length), `${q.filter((a) => a.type === "Timesheet").length} Timesheets · ${q.filter((a) => a.type === "Expense").length} Expenses`)}
      ${kpi("TEAM HOURS", `${hrs(t.hours)}h`, `${hrs(t.billable)}h billable of ${t.target}h capacity`)}
      ${kpi("PROJECTS AT RISK", String(risky.length), risky.map((p) => p.code).join(" · ") || "All on track", risky.length ? "text-amber" : "teal")}
    </div>
    <div class="mid">
      <div class="card hours">
        ${cardHead("Team Utilization", "Billable share of hours logged last week", `<div class="date-chip">${icon("calendar")}Nov 09 - Nov 15</div>`)}
        <div class="divider"></div>
        <div class="legend"><span><i class="lg dark"></i>Billable</span><span><i class="lg light"></i>Non-billable</span></div>
        <div class="bars bars-wide">${S.team
          .map((m) => `<div class="bar-row"><span class="day day-wide">${esc(m.name.split(" ")[0])}</span><div class="track"><div class="fill" style="width:${pct(m.billable, m.hours)}%"></div></div><span class="hrs">${pct(m.billable, m.hours).toFixed(0)}%</span></div>`)
          .join("")}</div>
        <div class="divider"></div>
        <div class="card-foot"><span>Total: ${hrs(t.hours)} hrs</span><span>${hrs(t.billable)} hrs billable (${t.util.toFixed(1)}%)</span></div>
      </div>
      ${signoffCard("Approval Queue", q, 4)}
    </div>
    <div class="card timeline">
      ${cardHead("Project Budgets", "Hours used against budget on active engagements", `<a href="#/projects" class="link">All projects ${icon("chevronRight")}</a>`)}
      <div class="tl-grid">${S.projects.map(projectCard).join("")}</div>
    </div>`;
}

function projectCard(p) {
  const st = projectStatus(p);
  const u = pct(p.used, p.budget);
  return `<div class="tl-item">
    <div class="tl-top"><span>${esc(p.client.toUpperCase())}</span>${pill(st)}</div>
    <div class="tl-title">${esc(p.name)}</div>
    <div class="tl-sub">${p.code} · ${esc(p.type)} · Due ${p.due}</div>
    <div class="proj-progress">${progress(u, st === "Critical" ? "red" : st === "At risk" ? "amber" : "")}<span>${p.used.toLocaleString()} / ${p.budget.toLocaleString()} h</span></div>
  </div>`;
}

function viewTeam() {
  const t = teamStats();
  const rows = S.team.map((m) => {
    const u = pct(m.billable, m.hours);
    const reminded = S.ui.reminded.has(m.name);
    return [
      person(m.name, m.tone, esc(m.title)),
      `${hrs(m.hours)}h`,
      `${hrs(m.billable)}h`,
      `<div class="util">${progress(u, u < 70 ? "amber" : "")}<span>${u.toFixed(0)}%</span></div>`,
      pill(m.status),
      m.status === "Not submitted"
        ? `<button class="btn btn-sm btn-light" data-action="remind" data-name="${esc(m.name)}" ${reminded ? "disabled" : ""}>${icon(reminded ? "check" : "bell")}${reminded ? "Reminded" : "Remind"}</button>`
        : ""
    ];
  });

  return `
    ${pageHead("Team", "Hours, utilization and timesheet status for your direct reports.", btn("Export CSV", { icon: "download", action: "export", attrs: 'data-kind="team"' }))}
    <div class="kpis">
      ${kpi("TEAM MEMBERS", String(S.team.length), "Advisory — East")}
      ${kpi("UTILIZATION", `${t.util.toFixed(1)}%`, "Target 80%", "teal")}
      ${kpi("HOURS LOGGED", `${hrs(t.hours)}h`, `of ${t.target}h capacity`)}
      ${kpi("NOT SUBMITTED", String(S.team.filter((m) => m.status === "Not submitted").length), "Timesheets due Nov 15", "text-amber")}
    </div>
    <div class="card card-pad">
      ${cardHead("Week of Nov 09 – Nov 15", "Utilization below 70% is highlighted")}
      <div class="divider"></div>
      ${table([{ label: "Member" }, { label: "Logged", cls: "num" }, { label: "Billable", cls: "num" }, { label: "Utilization" }, { label: "Timesheet" }, { label: "", cls: "right" }], rows)}
    </div>`;
}

function viewProjects() {
  const totalB = sum(S.projects, (p) => p.budget);
  const totalU = sum(S.projects, (p) => p.used);
  const rows = S.projects.map((p) => {
    const st = projectStatus(p);
    const u = pct(p.used, p.budget);
    return [
      cell(esc(p.name), `${p.code} · ${esc(p.client)}`),
      esc(p.type),
      `<div class="util">${progress(u, st === "Critical" ? "red" : st === "At risk" ? "amber" : "")}<span>${u.toFixed(0)}%</span></div>`,
      `${p.used.toLocaleString()} / ${p.budget.toLocaleString()} h`,
      `${(p.budget - p.used).toLocaleString()} h`,
      p.due,
      pill(st)
    ];
  });

  return `
    ${pageHead("Projects", "Budget burn across the engagements your team delivers.")}
    <div class="kpis">
      ${kpi("ACTIVE PROJECTS", String(S.projects.length), "4 clients")}
      ${kpi("HOURS BUDGETED", `${totalB.toLocaleString()}h`, "Across active engagements")}
      ${kpi("HOURS USED", `${totalU.toLocaleString()}h`, `${pct(totalU, totalB).toFixed(1)}% of budget`)}
      ${kpi("NEEDS ATTENTION", String(S.projects.filter((p) => projectStatus(p) !== "On track").length), "85%+ of budget used", "text-amber")}
    </div>
    <div class="card card-pad">
      ${cardHead("Budget burn", "Projects at 85% are at risk, 95% are critical")}
      <div class="divider"></div>
      ${table([{ label: "Project" }, { label: "Billing" }, { label: "Burn" }, { label: "Used / Budget", cls: "num" }, { label: "Remaining", cls: "num" }, { label: "Due" }, { label: "Status" }], rows)}
    </div>
    <div class="tl-grid">${S.projects.map(projectCard).join("")}</div>`;
}

function reportList(items) {
  return `<div class="report-list">${items
    .map((r) => `<div class="report-row"><div class="task-ic">${icon("file")}</div><div class="so-info">${cell(r.title, r.sub)}</div><button class="btn btn-sm btn-light" data-action="export" data-kind="${r.kind}">${icon("download")}Export</button></div>`)
    .join("")}</div>`;
}

function viewManagerReports() {
  const t = teamStats();
  const max = Math.max(...S.projects.map((p) => p.used));
  return `
    ${pageHead("Reports", "Team performance and project delivery reporting.")}
    <div class="kpis">
      ${kpi("UTILIZATION", `${t.util.toFixed(1)}%`, "+1.8% vs prior week", "teal")}
      ${kpi("BILLABLE HOURS", `${hrs(t.billable)}h`, "Nov 09 – Nov 15")}
      ${kpi("TEAM SPEND (MTD)", "$2,941.20", "18 expenses · 2 flagged")}
      ${kpi("AVG. APPROVAL TIME", "1.4 days", "Target under 2 days", "teal")}
    </div>
    <div class="grid-2">
      <div class="card card-pad">
        ${cardHead("Hours by project", "Total hours used to date")}
        <div class="divider"></div>
        <div class="bars bars-wide">${S.projects.map((p) => `<div class="bar-row"><span class="day day-wide">${p.code}</span><div class="track"><div class="fill" style="width:${pct(p.used, max)}%"></div></div><span class="hrs hrs-wide">${p.used.toLocaleString()}h</span></div>`).join("")}</div>
      </div>
      <div class="card card-pad">
        ${cardHead("Available reports", "Download as CSV")}
        <div class="divider"></div>
        ${reportList([
          { title: "Utilization by member", sub: "Billable vs. non-billable hours", kind: "team" },
          { title: "Project budget burn", sub: "Budget, used and remaining hours", kind: "projects" },
          { title: "Team expenses", sub: "Pending and approved spend", kind: "approvals" }
        ])}
      </div>
    </div>`;
}

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

const ORG_TARGET = 85;

function orgStats() {
  const hours = sum(S.orgTimesheets, (t) => t.hours);
  const billable = sum(S.orgTimesheets, (t) => t.billable);
  return { hours, billable, util: pct(billable, hours) };
}

function readyInvoices() {
  return S.invoices.filter((i) => i.status === "Ready");
}

function viewAdminDashboard() {
  const q = S.approvals.admin;
  const ready = readyInvoices();
  const batch = S.payout;
  const batchTotal = sum(batch.lines, (l) => l.amount);
  const receipts = sum(batch.lines, (l) => l.receipts);
  const o = orgStats();

  return `
    ${pageHead("Executive Overview", "Billable time, approvals, invoicing and reimbursements across the company.", btn("Export summary", { icon: "download", action: "export", attrs: 'data-kind="summary"' }))}
    <div class="kpis">
      ${kpi("BILLABLE UTILIZATION", `${o.util.toFixed(1)}%`, `Target ${ORG_TARGET}% · Nov 09 – Nov 15`, o.util >= ORG_TARGET ? "teal" : "text-amber")}
      ${kpi("PENDING APPROVALS", String(q.length), `${q.filter((a) => a.type === "Timesheet").length} Timesheets · ${q.filter((a) => a.type === "Expense").length} Expenses`)}
      ${kpi("READY TO INVOICE", money(sum(ready, (i) => i.amount)), `${ready.length} invoices · Net-30 terms`)}
      ${kpi("EXPENSE DISBURSEMENTS", money(batchTotal), `Payout ${batch.status === "Scheduled" ? "scheduled" : "processing"} Nov 20`)}
    </div>
    <div class="mid">
      <div class="card hours">
        ${cardHead("Utilization by Team", "Billable share of hours logged last week", `<div class="date-chip">${icon("calendar")}Nov 09 - Nov 15</div>`)}
        <div class="divider"></div>
        <div class="legend"><span><i class="lg dark"></i>Billable (${o.billable.toLocaleString()}h)</span><span><i class="lg light"></i>Non-billable (${(o.hours - o.billable).toLocaleString()}h)</span></div>
        <div class="bars bars-wide">${S.orgTimesheets
          .map((t) => `<div class="bar-row"><span class="day day-team">${esc(t.team)}</span><div class="track"><div class="fill" style="width:${pct(t.billable, t.hours)}%"></div></div><span class="hrs">${pct(t.billable, t.hours).toFixed(0)}%</span></div>`)
          .join("")}</div>
        <div class="divider"></div>
        <div class="card-foot"><span>Total: ${o.hours.toLocaleString()} hrs</span><span>${o.billable.toLocaleString()} hrs billable (${o.util.toFixed(1)}%)</span></div>
      </div>
      ${signoffCard("Pending Sign-Off", q, 3)}
    </div>
    <div class="card timeline">
      ${cardHead("Billing &amp; Payout Schedule", "Upcoming invoicing, payouts and accounting sync", `<div class="ledger">${icon("checkCircle")}Period closes Nov 30, 23:59 EST</div>`)}
      <div class="tl-grid">
        <a class="tl-item" href="#/reports">
          <div class="tl-top"><span>NOV 30, 2026</span>${pill(ready.length ? "Scheduled" : "Sent", ready.length ? "blue" : "mint")}</div>
          <div class="tl-title">Next Invoice Run</div>
          <div class="tl-sub">${ready.length} customer invoices · ${money0(sum(ready, (i) => i.amount))}</div>
        </a>
        <a class="tl-item" href="#/reimbursements">
          <div class="tl-top"><span>NOV 20, 2026</span>${pill(batch.status, batch.status === "Scheduled" ? "blue" : "amber")}</div>
          <div class="tl-title">Direct Deposit / ACH</div>
          <div class="tl-sub">${receipts} receipts · ${money(batchTotal)}</div>
        </a>
        <a class="tl-item" href="#/settings">
          <div class="tl-top"><span>NETSUITE LIVE</span><span class="pill pill-mint"><i></i>Active</span></div>
          <div class="tl-title">ERP Sync Status</div>
          <div class="tl-sub">Synced 14m ago · 0 conflicts</div>
        </a>
      </div>
    </div>`;
}

function viewOrgTimesheets() {
  const o = S.orgTimesheets;
  const head = sum(o, (t) => t.headcount);
  const sub = sum(o, (t) => t.submitted);
  const appr = sum(o, (t) => t.approved);
  const missing = S.missing.filter((m) => !S.ui.reminded.has(m.name));

  return `
    ${pageHead("Timesheets", "Company-wide timesheet compliance for the week of Nov 09 – Nov 15.", btn("Export CSV", { icon: "download", action: "export", attrs: 'data-kind="org-timesheets"' }) + btn("Remind all missing", { icon: "bell", cls: "btn-primary", action: "remind-all", disabled: !missing.length }))}
    <div class="kpis">
      ${kpi("SUBMITTED", `${sub} / ${head}`, `${pct(sub, head).toFixed(0)}% compliance`, "teal")}
      ${kpi("APPROVED", String(appr), `${sub - appr} waiting on managers`)}
      ${kpi("NOT SUBMITTED", String(head - sub), "Due Sun, Nov 15", "text-amber")}
      ${kpi("HOURS LOGGED", `${sum(o, (t) => t.hours).toLocaleString()}h`, "Across 5 teams")}
    </div>
    <div class="grid-2 grid-wide">
      <div class="card card-pad">
        ${cardHead("By team", "Submission and approval progress")}
        <div class="divider"></div>
        ${table(
          [{ label: "Team" }, { label: "Submitted" }, { label: "Approved", cls: "num" }, { label: "Hours", cls: "num" }],
          o.map((t) => [cell(esc(t.team), `Manager: ${esc(t.manager)}`), `<div class="util">${progress(pct(t.submitted, t.headcount), t.submitted < t.headcount ? "amber" : "")}<span>${t.submitted}/${t.headcount}</span></div>`, t.approved, t.hours.toLocaleString()])
        )}
      </div>
      <div class="card card-pad">
        ${cardHead("Missing timesheets", "People who haven't submitted yet")}
        <div class="divider"></div>
        <div class="report-list">${S.missing
          .map((m) => {
            const done = S.ui.reminded.has(m.name);
            return `<div class="report-row">${avatar(m.name, "amber")}<div class="so-info">${cell(esc(m.name), `${esc(m.team)} · ${hrs(m.logged)}h logged`)}</div><button class="btn btn-sm btn-light" data-action="remind" data-name="${esc(m.name)}" ${done ? "disabled" : ""}>${icon(done ? "check" : "bell")}${done ? "Reminded" : "Remind"}</button></div>`;
          })
          .join("")}</div>
      </div>
    </div>`;
}

function viewLedger() {
  const l = S.ledger;
  const f = S.ui.ledgerFilter;
  const shown = f === "All" ? l : f === "Flagged" ? l.filter((e) => e.flag) : l.filter((e) => e.status === f);
  const totalCat = sum(S.spendByCategory, (c) => c.value);
  const max = Math.max(...S.spendByCategory.map((c) => c.value));

  return `
    ${pageHead("Expenses", "Every expense across the company, with policy checks applied.", btn("Export CSV", { icon: "download", action: "export", attrs: 'data-kind="ledger"' }))}
    <div class="kpis">
      ${kpi("SPEND (MTD)", money0(totalCat), "November 2026 · 312 expenses")}
      ${kpi("OUT OF POLICY", String(l.filter((e) => e.flag).length), "Flagged for review", "text-amber")}
      ${kpi("MISSING RECEIPTS", String(l.filter((e) => e.flag === "Missing receipt").length), "Blocked from payout")}
      ${kpi("AVG. PROCESSING", "2.1 days", "Submit to payout", "teal")}
    </div>
    <div class="grid-2 grid-wide">
      <div class="card card-pad">
        <div class="card-head wrap">${tabs("ledgerFilter", ["All", "Flagged", "Submitted", "Approved", "Paid", "Rejected"].map((x) => ({ label: x })))}</div>
        <div class="divider"></div>
        ${table(
          [{ label: "Employee" }, { label: "Merchant" }, { label: "Category" }, { label: "Amount", cls: "num" }, { label: "Policy" }, { label: "Status" }],
          shown.map((e) => [
            cell(esc(e.name), e.date),
            cell(esc(e.merchant), e.id),
            esc(e.category),
            `<span class="strong">${money(e.amount)}</span>`,
            e.flag ? `<span class="flag">${icon("alert", "ic-sm")}${esc(e.flag)}</span>` : `<span class="text-teal ok">${icon("check", "ic-sm")}OK</span>`,
            pill(e.status)
          ]),
          { empty: "No expenses match this filter." }
        )}
      </div>
      <div class="card card-pad">
        ${cardHead("Spend by category", "Month to date")}
        <div class="divider"></div>
        <div class="bars bars-wide">${S.spendByCategory.map((c) => `<div class="bar-row stacked"><div class="bar-label"><span>${c.label}</span><span class="strong">${money0(c.value)} <span class="muted-text">· ${pct(c.value, totalCat).toFixed(0)}%</span></span></div><div class="track"><div class="fill" style="width:${pct(c.value, max)}%"></div></div></div>`).join("")}</div>
      </div>
    </div>`;
}

function viewInvoicing() {
  const ready = readyInvoices();
  const ar = S.invoices.filter((i) => i.status === "Sent" || i.status === "Overdue");
  const rows = S.invoices.map((i) => [
    cell(i.id, esc(i.basis)),
    cell(esc(i.client), i.project),
    `<span class="strong">${money(i.amount)}</span>`,
    i.due,
    pill(i.status),
    i.status === "Ready" ? `<button class="btn btn-sm btn-primary" data-action="send-invoice" data-id="${i.id}">${icon("send")}Send</button>` : i.status === "Overdue" ? `<button class="btn btn-sm btn-light" data-action="remind-invoice" data-id="${i.id}">${icon("bell")}Remind</button>` : ""
  ]);

  return `
    ${pageHead("Reports &amp; Invoicing", "Turn approved billable time into client invoices and track receivables.", btn("Export CSV", { icon: "download", action: "export", attrs: 'data-kind="invoices"' }) + btn(`Send all ready (${ready.length})`, { icon: "send", cls: "btn-primary", action: "send-all-invoices", disabled: !ready.length }))}
    <div class="kpis">
      ${kpi("READY TO INVOICE", money(sum(ready, (i) => i.amount)), `${ready.length} invoices · Net-30`)}
      ${kpi("OUTSTANDING AR", money(sum(ar, (i) => i.amount)), `${ar.filter((i) => i.status === "Overdue").length} overdue`, ar.some((i) => i.status === "Overdue") ? "text-red" : "")}
      ${kpi("COLLECTED (MTD)", money(31200), "November 2026", "teal")}
      ${kpi("DSO", "34 days", "Target 30 days")}
    </div>
    <div class="card card-pad">
      ${cardHead("Invoices", "Draft invoices are generated from manager- and finance-approved time")}
      <div class="divider"></div>
      ${table([{ label: "Invoice" }, { label: "Client" }, { label: "Amount", cls: "num" }, { label: "Due" }, { label: "Status" }, { label: "", cls: "right" }], rows)}
    </div>
    <div class="card card-pad">
      ${cardHead("Reports", "Download as CSV")}
      <div class="divider"></div>
      ${reportList([
        { title: "Invoice register", sub: "All invoices with status and due dates", kind: "invoices" },
        { title: "Expense ledger", sub: "Company-wide expenses with policy flags", kind: "ledger" },
        { title: "Timesheet compliance", sub: "Submission and approval by team", kind: "org-timesheets" }
      ])}
    </div>`;
}

function viewPayouts() {
  const b = S.payout;
  const total = sum(b.lines, (l) => l.amount);
  const receipts = sum(b.lines, (l) => l.receipts);
  return `
    ${pageHead("Payouts", "Reimburse approved employee expenses through ADP direct deposit.", b.status === "Scheduled" ? btn("Release batch", { icon: "send", cls: "btn-primary", action: "release-batch" }) : "")}
    <div class="kpis">
      ${kpi("NEXT BATCH", money(total), `${b.id} · ${b.date}`)}
      ${kpi("RECEIPTS", String(receipts), `${b.lines.length} employees`)}
      ${kpi("BATCH STATUS", b.status, b.status === "Scheduled" ? "Releases automatically Nov 20, 06:00 EST" : "Sent to ADP · settles in 1–2 days", b.status === "Scheduled" ? "" : "text-amber")}
      ${kpi("PAID (YTD)", "$84,216.40", "21 batches", "teal")}
    </div>
    <div class="grid-2 grid-wide">
      <div class="card card-pad">
        ${cardHead(`${b.id} · ${b.date}`, "Approved expenses included in this batch", pill(b.status))}
        <div class="divider"></div>
        ${table(
          [{ label: "Employee" }, { label: "Receipts", cls: "num" }, { label: "Account" }, { label: "Amount", cls: "num" }],
          b.lines.map((l) => [person(l.name, "blue"), l.receipts, l.account, `<span class="strong">${money(l.amount)}</span>`])
        )}
        <div class="divider"></div>
        <div class="card-foot"><span>Total</span><span>${money(total)}</span></div>
      </div>
      <div class="card card-pad">
        ${cardHead("Previous batches")}
        <div class="divider"></div>
        ${table(
          [{ label: "Batch" }, { label: "Amount", cls: "num" }, { label: "Status" }],
          S.payoutHistory.map((h) => [cell(h.id, `${h.date} · ${h.receipts} receipts`), `<span class="strong">${money(h.amount)}</span>`, pill(h.status)])
        )}
      </div>
    </div>`;
}

function toggle(key, title, sub) {
  return `<div class="setting-row"><div>${cell(title, sub)}</div><label class="switch"><input type="checkbox" data-setting="${key}" ${S.settings[key] ? "checked" : ""}><span></span></label></div>`;
}

function viewSettings() {
  const steps = [
    ["Employee submits", "Timesheets weekly, expenses any time"],
    ["Manager approves", "Direct manager or project lead"],
    ["Finance review", "All timesheets, and expenses over $500"],
    ["Invoice &amp; payout", "Billing run and ADP direct deposit"]
  ];
  return `
    ${pageHead("Policy &amp; Settings", "Spending limits, approval routing, timesheet rules and integrations.")}
    <div class="card card-pad">
      ${cardHead("Approval workflow", "How submissions move through the company")}
      <div class="divider"></div>
      <ol class="steps">${steps.map((s, i) => `<li><span class="step-n">${i + 1}</span>${cell(s[0], s[1])}</li>`).join("")}</ol>
    </div>
    <div class="grid-2">
      <div class="card card-pad">
        ${cardHead("Expense policy", "Limits applied when expenses are submitted")}
        <div class="divider"></div>
        ${table(
          [{ label: "Category" }, { label: "Limit" }, { label: "Receipt" }, { label: "Approval" }],
          S.policies.map((p) => [`<span class="strong">${p.category}</span>`, p.limit, p.receipt, p.approval])
        )}
        <div class="divider"></div>
        ${toggle("autoApprove", "Auto-approve small expenses", "Expenses under $25 with a receipt skip manager review")}
        ${toggle("receiptOver25", "Require receipts over $25", "Submissions without a receipt are blocked")}
        ${toggle("financeOver500", "Finance review over $500", "Adds a finance step for large expenses")}
      </div>
      <div class="card card-pad">
        ${cardHead("Timesheet rules")}
        <div class="divider"></div>
        <div class="rules">
          <div><span>Week starts</span><span class="strong">Monday</span></div>
          <div><span>Submission deadline</span><span class="strong">Friday, 5:00 PM local</span></div>
          <div><span>Standard week</span><span class="strong">40.0 hours</span></div>
          <div><span>Period lock</span><span class="strong">Nov 30, 23:59 EST</span></div>
        </div>
        <div class="divider"></div>
        ${toggle("overtimeAlerts", "Overtime alerts", "Flag timesheets above 40 hours for finance review")}
        ${toggle("weekendEntry", "Allow weekend entries", "Let employees log hours on Saturday and Sunday")}
        ${toggle("lockAfterClose", "Lock after ledger close", "Prevent edits to periods that are already closed")}
      </div>
    </div>
    <div class="card card-pad">
      ${cardHead("Integrations", "Connected finance, payroll and identity systems")}
      <div class="divider"></div>
      <div class="integrations">${S.integrations
        .map((x) => `<div class="tl-item integration"><div class="tl-top"><span class="int-name">${icon("plug")}${esc(x.name)}</span>${pill(x.status)}</div><div class="tl-sub">${esc(x.desc)}</div><div class="int-foot"><span class="muted-text">${esc(x.meta)}</span>${x.status === "Connected" ? `<button class="btn btn-sm btn-light" data-action="sync" data-name="${esc(x.name)}">Sync now</button>` : `<button class="btn btn-sm btn-primary" data-action="connect" data-name="${esc(x.name)}">Connect</button>`}</div></div>`)
        .join("")}</div>
    </div>`;
}

/* Which view renders for each role and page. */
const VIEWS = {
  employee: {
    dashboard: viewEmployeeDashboard,
    timesheets: () => viewMyTimesheets("employee"),
    expenses: () => viewMyExpenses("employee"),
    reimbursements: viewEmployeeReimbursements
  },
  manager: {
    dashboard: viewManagerDashboard,
    approvals: () => viewApprovals("manager"),
    team: viewTeam,
    projects: viewProjects,
    timesheets: () => viewMyTimesheets("manager"),
    expenses: () => viewMyExpenses("manager"),
    reports: viewManagerReports
  },
  admin: {
    dashboard: viewAdminDashboard,
    timesheets: viewOrgTimesheets,
    expenses: viewLedger,
    approvals: () => viewApprovals("admin"),
    reports: viewInvoicing,
    reimbursements: viewPayouts,
    settings: viewSettings
  }
};
