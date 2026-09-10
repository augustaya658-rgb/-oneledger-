import React, { useState, useMemo } from "react";
import {
  Dumbbell, ShoppingBasket, Home, Users, IndianRupee, Bell, Plus, X,
  Check, MessageCircle, Search, Flame, ArrowRightLeft, TrendingUp,
  LayoutGrid, Wallet, CalendarCheck, BookOpen, ChevronRight
} from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');`;

const todayISO = () => new Date().toISOString().slice(0, 10);
const addMonths = (dateStr, months) => { const d = new Date(dateStr); d.setMonth(d.getMonth() + Number(months)); return d.toISOString().slice(0, 10); };
const addDays = (dateStr, days) => { const d = new Date(dateStr); d.setDate(d.getDate() + Number(days)); return d.toISOString().slice(0, 10); };
const daysUntil = (dateStr) => { const t0 = new Date(); t0.setHours(0,0,0,0); const t1 = new Date(dateStr); t1.setHours(0,0,0,0); return Math.round((t1 - t0) / 86400000); };
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const fmtMoney = (n) => `\u20B9${Number(n).toLocaleString("en-IN")}`;
const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// Premium ink palette — cream paper, brass accent, muted semantic tones
const INK = "#211C12";
const MUTED = "#8A8168";
const HAIRLINE = "#E6DFC8";
const CARD = "#FFFFFF";
const PAGE = "#F4EEDF";
const BRASS = "#A9812F";
const BRASS_SOFT = "#8C6A2F";
const STATUS = {
  good: { c: "#4F8F5E", bg: "#EAF2E8" },
  warn: { c: "#B8863A", bg: "#F7ECD8" },
  bad:  { c: "#B15A47", bg: "#F6E5DF" },
};
const STAGES = ["new", "contacted", "visit", "negotiation", "closed"];

function Avatar({ name, ring }) {
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11.5px] font-medium shrink-0"
      style={{ background: "#F1EAD4", color: BRASS_SOFT, boxShadow: `inset 0 0 0 1.5px ${ring}` }}>
      {initials(name)}
    </div>
  );
}

function StageTrack({ stage }) {
  const idx = STAGES.indexOf(stage);
  return (
    <div className="min-w-[100px]">
      <div className="text-[12.5px] capitalize mb-1.5 truncate" style={{ color: INK }}>{stage === "visit" ? "Site visit" : stage}</div>
      <div className="flex items-center gap-[3px]">
        {STAGES.map((s, i) => (
          <div key={s} className="h-[3px] flex-1 rounded-full" style={{ background: i <= idx ? BRASS : "#EAE3CE" }} />
        ))}
      </div>
    </div>
  );
}

const VERTICALS = {
  gym: {
    icon: Dumbbell, label: "Gym & fitness", tagline: "Members, renewals, streaks",
    entitySingular: "Member", entityPlural: "Members", addLabel: "Add member",
    fields: [
      { key: "plan", label: "Plan", type: "select", default: 1,
        options: [{ v: 1, l: "1 month" }, { v: 3, l: "3 months" }, { v: 6, l: "6 months" }, { v: 12, l: "12 months" }] },
      { key: "fee", label: "Fee (\u20B9)", type: "number", default: 1000 },
    ],
    computeOnAdd: (e) => ({ ...e, joinDate: todayISO(), expiryDate: addMonths(todayISO(), e.plan), streak: 0 }),
    statusOf: (e) => { const d = daysUntil(e.expiryDate); return d < 0 ? "bad" : d <= 7 ? "warn" : "good"; },
    columns: [
      { label: "Plan", render: (e) => (<div className="truncate"><div>{e.plan}{e.plan == 1 ? " month" : " months"}</div><div className="text-[11px]" style={{ color: MUTED }}>{fmtMoney(e.fee)}/mo</div></div>) },
      { label: "Expiry", render: (e) => <span className="whitespace-nowrap">{fmtDate(e.expiryDate)}</span> },
      { label: "Streak", render: (e) => (<span className="flex items-center gap-1 whitespace-nowrap"><Flame size={13} style={{ color: BRASS }} strokeWidth={2} />{e.streak}d</span>) },
    ],
    attentionText: (e) => { const d = daysUntil(e.expiryDate); return d < 0 ? `Expired ${Math.abs(d)}d ago` : `Expires in ${d}d`; },
    attentionSort: (a, b) => daysUntil(a.expiryDate) - daysUntil(b.expiryDate),
    reminderMsg: (e, biz) => `Hi ${e.name.split(" ")[0]}, your membership at ${biz} ${daysUntil(e.expiryDate) < 0 ? "has expired" : "is expiring soon"} on ${fmtDate(e.expiryDate)}. Renew today to keep your streak going.`,
    stats: (list) => [
      { label: "Total members", value: list.length, icon: Users },
      { label: "Active", value: list.filter((e) => VERTICALS.gym.statusOf(e) === "good").length, icon: Check, tone: "good" },
      { label: "Expiring soon", value: list.filter((e) => VERTICALS.gym.statusOf(e) === "warn").length, icon: Bell, tone: "warn" },
      { label: "Monthly collection", value: fmtMoney(list.reduce((s, e) => s + Number(e.fee), 0)), icon: IndianRupee, tone: "brass" },
    ],
    seed: [
      { id: 1, name: "Ramesh Yadav", phone: "98110xxxxx", plan: 1, fee: 1200, joinDate: "2026-08-05", expiryDate: "2026-09-11", streak: 14 },
      { id: 2, name: "Priya Sharma", phone: "99530xxxxx", plan: 6, fee: 900, joinDate: "2026-04-02", expiryDate: "2026-10-02", streak: 41 },
      { id: 3, name: "Vikas Chauhan", phone: "97170xxxxx", plan: 3, fee: 1000, joinDate: "2026-06-15", expiryDate: "2026-09-15", streak: 3 },
      { id: 4, name: "Sandeep Rathi", phone: "98920xxxxx", plan: 1, fee: 1200, joinDate: "2026-07-30", expiryDate: "2026-08-30", streak: 0 },
      { id: 5, name: "Neha Kapoor", phone: "95991xxxxx", plan: 3, fee: 1000, joinDate: "2026-07-01", expiryDate: "2026-10-01", streak: 22 },
    ],
  },
  kirana: {
    icon: ShoppingBasket, label: "Kirana store", tagline: "Udhaar, due dates, reminders",
    entitySingular: "Customer", entityPlural: "Customers", addLabel: "Add customer",
    fields: [
      { key: "udhaar", label: "Udhaar amount (\u20B9)", type: "number", default: 500 },
      { key: "creditDays", label: "Credit period (days)", type: "select", default: 15,
        options: [{ v: 7, l: "7 days" }, { v: 15, l: "15 days" }, { v: 30, l: "30 days" }] },
    ],
    computeOnAdd: (e) => ({ ...e, lastPurchase: todayISO(), dueDate: addDays(todayISO(), e.creditDays) }),
    statusOf: (e) => { const d = daysUntil(e.dueDate); return d < 0 ? "bad" : d <= 3 ? "warn" : "good"; },
    columns: [
      { label: "Udhaar", render: (e) => <span className="whitespace-nowrap">{fmtMoney(e.udhaar)}</span> },
      { label: "Due date", render: (e) => <span className="whitespace-nowrap">{fmtDate(e.dueDate)}</span> },
      { label: "Last buy", render: (e) => <span className="whitespace-nowrap">{fmtDate(e.lastPurchase)}</span> },
    ],
    attentionText: (e) => { const d = daysUntil(e.dueDate); return d < 0 ? `Overdue by ${Math.abs(d)}d` : `Due in ${d}d`; },
    attentionSort: (a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate),
    reminderMsg: (e, biz) => `Namaste ${e.name.split(" ")[0]}, aapka ${fmtMoney(e.udhaar)} udhaar ${biz} mein bakaya hai, due date ${fmtDate(e.dueDate)} hai. Kripya jaldi clear kar dijiye.`,
    stats: (list) => [
      { label: "Total customers", value: list.length, icon: Users },
      { label: "Clear", value: list.filter((e) => VERTICALS.kirana.statusOf(e) === "good").length, icon: Check, tone: "good" },
      { label: "Due this week", value: list.filter((e) => VERTICALS.kirana.statusOf(e) !== "good").length, icon: Bell, tone: "warn" },
      { label: "Total udhaar out", value: fmtMoney(list.reduce((s, e) => s + Number(e.udhaar), 0)), icon: IndianRupee, tone: "brass" },
    ],
    seed: [
      { id: 1, name: "Suresh Kumar", phone: "98110xxxxx", udhaar: 850, creditDays: 15, lastPurchase: "2026-08-28", dueDate: "2026-09-12" },
      { id: 2, name: "Meena Devi", phone: "99530xxxxx", udhaar: 320, creditDays: 7, lastPurchase: "2026-09-01", dueDate: "2026-09-08" },
      { id: 3, name: "Ashok Gupta", phone: "97170xxxxx", udhaar: 1500, creditDays: 30, lastPurchase: "2026-08-15", dueDate: "2026-09-14" },
      { id: 4, name: "Kavita Singh", phone: "98920xxxxx", udhaar: 200, creditDays: 15, lastPurchase: "2026-08-20", dueDate: "2026-09-04" },
    ],
  },
  property: {
    icon: Home, label: "Property dealer", tagline: "Leads, visits, follow-ups",
    entitySingular: "Lead", entityPlural: "Leads", addLabel: "Add lead",
    fields: [
      { key: "interest", label: "Interested in", type: "text", default: "" },
      { key: "budget", label: "Budget (\u20B9)", type: "number", default: 2500000 },
      { key: "stage", label: "Stage", type: "select", default: "new",
        options: [{ v: "new", l: "New" }, { v: "contacted", l: "Contacted" }, { v: "visit", l: "Site visit" }, { v: "negotiation", l: "Negotiation" }, { v: "closed", l: "Closed" }] },
    ],
    computeOnAdd: (e) => ({ ...e, addedDate: todayISO() }),
    statusOf: (e) => (e.stage === "closed" ? "good" : e.stage === "new" ? "bad" : "warn"),
    columns: [
      { label: "Interested in", render: (e) => <span className="truncate block">{e.interest || "\u2014"}</span> },
      { label: "Budget", render: (e) => <span className="whitespace-nowrap">{fmtMoney(e.budget)}</span> },
      { label: "Stage", render: (e) => <StageTrack stage={e.stage} /> },
    ],
    attentionText: () => "Not contacted yet",
    attentionSort: (a, b) => new Date(b.addedDate) - new Date(a.addedDate),
    reminderMsg: (e, biz) => `Hi ${e.name.split(" ")[0]}, this is ${biz}. Thanks for your interest in ${e.interest || "the property"} \u2014 would you like to schedule a site visit this week?`,
    stats: (list) => [
      { label: "Total leads", value: list.length, icon: Users },
      { label: "In pipeline", value: list.filter((e) => !["new", "closed"].includes(e.stage)).length, icon: TrendingUp, tone: "good" },
      { label: "Unattended", value: list.filter((e) => e.stage === "new").length, icon: Bell, tone: "warn" },
      { label: "Pipeline value", value: fmtMoney(list.filter((e) => e.stage !== "closed").reduce((s, e) => s + Number(e.budget), 0)), icon: IndianRupee, tone: "brass" },
    ],
    seed: [
      { id: 1, name: "Arjun Malhotra", phone: "98110xxxxx", interest: "3BHK, Sector 45", budget: 6500000, stage: "visit", addedDate: "2026-09-02" },
      { id: 2, name: "Deepa Iyer", phone: "99530xxxxx", interest: "2BHK, resale", budget: 3200000, stage: "new", addedDate: "2026-09-08" },
      { id: 3, name: "Rohit Bansal", phone: "97170xxxxx", interest: "Commercial shop", budget: 9000000, stage: "negotiation", addedDate: "2026-08-20" },
      { id: 4, name: "Farhan Sheikh", phone: "98920xxxxx", interest: "1BHK, rent", budget: 1200000, stage: "new", addedDate: "2026-09-09" },
    ],
  },
};

const NAV_BY_VERTICAL = {
  gym: [ { icon: LayoutGrid, label: "Overview", active: true }, { icon: Users, label: "Members" }, { icon: CalendarCheck, label: "Attendance" }, { icon: Wallet, label: "Payments" } ],
  kirana: [ { icon: LayoutGrid, label: "Overview", active: true }, { icon: Users, label: "Customers" }, { icon: Wallet, label: "Udhaar book" }, { icon: Bell, label: "Reminders" } ],
  property: [ { icon: LayoutGrid, label: "Overview", active: true }, { icon: Users, label: "Leads" }, { icon: CalendarCheck, label: "Site visits" }, { icon: Wallet, label: "Deals" } ],
};

function GoldButton({ children, onClick, type = "button", className = "" }) {
  return (
    <button type={type} onClick={onClick}
      className={`shrink-0 text-[13px] font-semibold px-4 py-2.5 rounded-[6px] transition-transform active:scale-[0.97] ${className}`}
      style={{ background: `linear-gradient(180deg, #C9A15D, ${BRASS_SOFT})`, color: "#FBF6EA", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(140,106,47,0.35)" }}>
      {children}
    </button>
  );
}

function OneLedgerCream() {
  const [bizType, setBizType] = useState(null);
  const [bizName, setBizName] = useState("");
  const [entities, setEntities] = useState({});
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });

  const cfg = bizType ? VERTICALS[bizType] : null;
  const list = bizType ? (entities[bizType] || VERTICALS[bizType].seed) : [];
  const filtered = list.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));
  const attention = useMemo(() => cfg ? [...list].filter((e) => cfg.statusOf(e) !== "good").sort(cfg.attentionSort).slice(0, 3) : [], [cfg, list]);

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(null), 2600); };

  const selectBiz = (key, nameGuess) => {
    setBizType(key);
    setBizName(nameGuess);
    setEntities((prev) => ({ ...prev, [key]: prev[key] || VERTICALS[key].seed }));
    const defaults = {};
    VERTICALS[key].fields.forEach((f) => (defaults[f.key] = f.default));
    setForm({ name: "", phone: "", ...defaults });
  };

  const addEntity = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const base = { id: Date.now(), name: form.name.trim(), phone: form.phone.trim() || "\u2014" };
    cfg.fields.forEach((f) => (base[f.key] = form[f.key] ?? f.default));
    const full = cfg.computeOnAdd(base);
    setEntities((prev) => ({ ...prev, [bizType]: [full, ...(prev[bizType] || cfg.seed)] }));
    const defaults = {};
    cfg.fields.forEach((f) => (defaults[f.key] = f.default));
    setForm({ name: "", phone: "", ...defaults });
    setShowAdd(false);
    showToast(`${full.name} added to the ledger`);
  };

  const confirmSend = () => { if (!preview) return; showToast(`Reminder sent to ${preview.name}`); setPreview(null); };

  // ---- Onboarding: choose industry ----
  if (!bizType) {
    const options = [
      { key: "gym", nameGuess: "Powerhouse Gym" },
      { key: "kirana", nameGuess: "Sharma Kirana Store" },
      { key: "property", nameGuess: "Malhotra Properties" },
    ];
    return (
      <div style={{ fontFamily: "Inter, sans-serif", background: PAGE, boxSizing: "border-box", borderColor: HAIRLINE }} className="w-full flex flex-col items-center py-16 px-5 rounded-lg relative overflow-hidden border">
        <style>{FONT_IMPORT}</style>
        <div className="absolute w-[360px] h-[360px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(169,129,47,0.10) 0%, rgba(169,129,47,0) 70%)", top: "-4%" }} />

        <div className="relative w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{ background: CARD, boxShadow: `inset 0 0 0 1.5px ${HAIRLINE}, 0 4px 14px rgba(140,106,47,0.14)` }}>
          <BookOpen size={19} strokeWidth={1.6} style={{ color: BRASS_SOFT }} />
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", color: INK }} className="relative text-[32px] sm:text-[38px] font-medium tracking-tight text-center leading-none">
          OneLedger
        </div>
        <div className="relative text-[13.5px] mt-3.5 mb-9 text-center max-w-[360px] leading-relaxed" style={{ color: MUTED }}>
          One core ledger, styled to run any relationship-driven business. Tell us what you run.
        </div>

        <div className="relative w-full max-w-[440px] flex flex-col gap-2.5">
          {options.map((opt) => {
            const v = VERTICALS[opt.key];
            return (
              <button key={opt.key} onClick={() => selectBiz(opt.key, opt.nameGuess)}
                className="group w-full text-left rounded-[10px] p-4 flex items-center gap-3.5 transition-all"
                style={{ background: CARD, border: `1px solid ${HAIRLINE}`, boxShadow: "0 1px 2px rgba(60,45,10,0.05)" }}
                onMouseEnter={(ev) => { ev.currentTarget.style.borderColor = BRASS; ev.currentTarget.style.boxShadow = "0 6px 18px rgba(140,106,47,0.14)"; }}
                onMouseLeave={(ev) => { ev.currentTarget.style.borderColor = HAIRLINE; ev.currentTarget.style.boxShadow = "0 1px 2px rgba(60,45,10,0.05)"; }}>
                <div className="w-11 h-11 rounded-[9px] flex items-center justify-center shrink-0" style={{ background: "#F1EAD4" }}>
                  <v.icon size={18} strokeWidth={1.7} style={{ color: BRASS_SOFT }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-medium truncate" style={{ color: INK }}>{v.label}</div>
                  <div className="text-[12px] truncate" style={{ color: MUTED }}>{v.tagline}</div>
                </div>
                <ChevronRight size={16} strokeWidth={2} style={{ color: "#C9BE9C" }} />
              </button>
            );
          })}
          <div className="w-full rounded-[10px] p-4 flex items-center gap-3.5 border border-dashed" style={{ borderColor: "#D9D0B2" }}>
            <div className="w-11 h-11 rounded-[9px] flex items-center justify-center shrink-0 border" style={{ borderColor: HAIRLINE }}>
              <ArrowRightLeft size={15} strokeWidth={1.7} style={{ color: "#B4AA88" }} />
            </div>
            <div className="min-w-0">
              <div className="text-[13.5px] truncate" style={{ color: MUTED }}>Salon, coaching, clinic&hellip;</div>
              <div className="text-[11.5px]" style={{ color: "#B4AA88" }}>Same engine, next module</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Dashboard shell ----
  const statsCards = cfg.stats(list);
  const nav = NAV_BY_VERTICAL[bizType];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: PAGE, borderColor: HAIRLINE }} className="w-full flex flex-col sm:flex-row rounded-lg overflow-hidden border">
      <style>{FONT_IMPORT}</style>

      {/* Mobile top bar (below sm) */}
      <div className="flex sm:hidden items-center justify-between px-4 py-3" style={{ background: CARD, borderBottom: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#F1EAD4" }}>
            <cfg.icon size={15} strokeWidth={1.9} style={{ color: BRASS_SOFT }} />
          </div>
          <div className="min-w-0">
            <div style={{ fontFamily: "'Fraunces', serif", color: INK }} className="text-[15px] font-medium leading-tight truncate">OneLedger</div>
            <div className="text-[10.5px] truncate" style={{ color: MUTED }}>{bizName || cfg.label}</div>
          </div>
        </div>
        <button onClick={() => setBizType(null)} aria-label="Switch business type"
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-[6px]" style={{ color: MUTED, border: `1px solid ${HAIRLINE}` }}>
          <ArrowRightLeft size={14} strokeWidth={1.9} />
        </button>
      </div>

      {/* Sidebar (sm and up) */}
      <aside className="hidden sm:flex w-[210px] shrink-0 flex-col" style={{ background: CARD, borderRight: `1px solid ${HAIRLINE}` }}>
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#F1EAD4" }}>
              <cfg.icon size={15} strokeWidth={1.9} style={{ color: BRASS_SOFT }} />
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", color: INK }} className="text-[16.5px] font-medium leading-tight">OneLedger</div>
          </div>
          <div className="text-[11px] mt-2 ml-[42px] truncate" style={{ color: MUTED }}>{bizName || cfg.label}</div>
        </div>

        <nav className="flex-1 px-3 pt-4 space-y-1">
          {nav.map((item) => (
            <div key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-[13.5px] cursor-pointer transition-colors"
              style={item.active
                ? { background: "#F1EAD4", color: BRASS_SOFT, fontWeight: 500 }
                : { color: MUTED }}>
              <item.icon size={16} strokeWidth={1.9} />
              {item.label}
            </div>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <button onClick={() => setBizType(null)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] text-[12.5px] transition-colors"
            style={{ color: MUTED, border: `1px solid ${HAIRLINE}` }}>
            <ArrowRightLeft size={14} strokeWidth={1.9} />
            Switch business type
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-7 pt-5 sm:pt-6 pb-4 sm:pb-5">
          <div className="min-w-0">
            <div style={{ fontFamily: "'Fraunces', serif", color: INK }} className="text-[19px] sm:text-[25px] font-medium tracking-tight leading-tight">
              {cfg.label} dashboard
            </div>
            <div className="text-[12px] sm:text-[12.5px] mt-1" style={{ color: MUTED }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </div>
          </div>
          <GoldButton onClick={() => setShowAdd(true)} className="flex items-center justify-center gap-1.5 self-start sm:self-auto">
            <Plus size={15} strokeWidth={2.5} />{cfg.addLabel}
          </GoldButton>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 px-4 sm:px-7">
          {statsCards.map((s) => {
            const tone = s.tone === "good" ? STATUS.good.c : s.tone === "warn" ? STATUS.warn.c : s.tone === "brass" ? BRASS : MUTED;
            return (
              <div key={s.label} className="rounded-[9px] px-3 py-3 sm:px-4 sm:py-4 min-w-0" style={{ background: CARD, border: `1px solid ${HAIRLINE}`, boxShadow: "0 1px 2px rgba(60,45,10,0.04)" }}>
                <div className="flex items-center justify-between gap-1.5">
                  <div className="text-[10.5px] sm:text-[11.5px] leading-snug" style={{ color: MUTED }}>{s.label}</div>
                  <s.icon size={13} strokeWidth={2} className="shrink-0" style={{ color: tone }} />
                </div>
                <div style={{ fontFamily: "'Fraunces', serif", color: INK }} className="text-[18px] sm:text-[24px] font-medium mt-1.5 sm:mt-2 tabular-nums truncate">
                  {s.value}
                </div>
              </div>
            );
          })}
        </div>

        {attention.length > 0 && (
          <div className="px-4 sm:px-7 mt-6">
            <div className="text-[13px] font-medium mb-3" style={{ color: INK }}>Needs attention</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
              {attention.map((e) => {
                const st = STATUS[cfg.statusOf(e)];
                return (
                  <div key={e.id} className="rounded-[9px] px-4 py-3.5 flex items-center justify-between gap-2 min-w-0" style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-medium truncate" style={{ color: INK }}>{e.name}</div>
                      <div className="text-[12px] mt-0.5 truncate" style={{ color: st.c }}>{cfg.attentionText(e)}</div>
                    </div>
                    <button onClick={() => setPreview(e)}
                      className="shrink-0 flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-[6px] transition-colors"
                      style={{ color: BRASS_SOFT, border: `1px solid ${HAIRLINE}` }}>
                      <MessageCircle size={12.5} strokeWidth={2.2} />Ping
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="px-4 sm:px-7 mt-6 pb-6 sm:pb-7 flex-1 min-h-0 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="text-[13px] font-medium" style={{ color: INK }}>All {cfg.entityPlural.toLowerCase()}</div>
            <div className="flex items-center gap-2 rounded-[6px] px-3 py-1.5 w-full sm:w-[220px]" style={{ background: "#FBF8F0", border: `1px solid ${HAIRLINE}` }}>
              <Search size={14} style={{ color: MUTED }} className="shrink-0" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search"
                className="bg-transparent text-[13px] outline-none w-full min-w-0" style={{ color: INK }} />
            </div>
          </div>

          <div className="rounded-[9px] overflow-x-auto" style={{ border: `1px solid ${HAIRLINE}` }}>
            <div className="min-w-[540px]">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_70px] gap-2 px-4 py-2.5 text-[11px]" style={{ background: "#FBF8F0", color: MUTED, borderBottom: `1px solid ${HAIRLINE}` }}>
                <div>{cfg.entitySingular}</div>
                {cfg.columns.map((c) => <div key={c.label} className="truncate">{c.label}</div>)}
                <div className="text-right">Ping</div>
              </div>
              <div className="max-h-[300px] overflow-y-auto" style={{ background: CARD }}>
                {filtered.map((e) => {
                  const st = STATUS[cfg.statusOf(e)];
                  return (
                    <div key={e.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_70px] gap-2 px-4 py-3 items-center transition-colors"
                      style={{ borderBottom: `1px solid #F1EBD9` }}>
                      <div className="min-w-0 flex items-center gap-2.5">
                        <Avatar name={e.name} ring={st.c} />
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium truncate" style={{ color: INK }}>{e.name}</div>
                          <div className="text-[11px] truncate" style={{ color: MUTED }}>{e.phone}</div>
                        </div>
                      </div>
                      {cfg.columns.map((c) => (
                        <div key={c.label} className="text-[12.5px] min-w-0" style={{ color: "#4A4432" }}>{c.render(e)}</div>
                      ))}
                      <div className="text-right">
                        <button onClick={() => setPreview(e)} style={{ color: MUTED }} title="Notify"><Bell size={15} strokeWidth={1.8} /></button>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && <div className="px-4 py-10 text-center text-[13px]" style={{ color: MUTED }}>No one matches "{query}" yet.</div>}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div onClick={(e) => e.stopPropagation()} className="rounded-[10px] w-full max-w-[380px] p-5 max-h-[90vh] overflow-y-auto"
            style={{ background: CARD, boxShadow: "0 24px 60px rgba(60,45,10,0.22)" }}>
            <div className="flex items-center justify-between mb-4">
              <div style={{ fontFamily: "'Fraunces', serif", color: INK }} className="text-[18px] font-medium">New {cfg.entitySingular.toLowerCase()}</div>
              <button onClick={() => setShowAdd(false)} style={{ color: MUTED }} aria-label="Close"><X size={18} /></button>
            </div>
            <form onSubmit={addEntity} className="space-y-3">
              <div>
                <label className="text-[12px]" style={{ color: MUTED }}>Full name</label>
                <input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-[6px] px-3 py-2 text-[13.5px] outline-none" style={{ background: "#FBF8F0", border: `1px solid ${HAIRLINE}`, color: INK }} placeholder="e.g. Karan Mehta" />
              </div>
              <div>
                <label className="text-[12px]" style={{ color: MUTED }}>Phone number</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-[6px] px-3 py-2 text-[13.5px] outline-none" style={{ background: "#FBF8F0", border: `1px solid ${HAIRLINE}`, color: INK }} placeholder="10-digit mobile" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {cfg.fields.map((f) => (
                  <div key={f.key} className={f.type === "text" ? "col-span-2" : ""}>
                    <label className="text-[12px]" style={{ color: MUTED }}>{f.label}</label>
                    {f.type === "select" ? (
                      <select value={form[f.key] ?? f.default} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="mt-1 w-full rounded-[6px] px-3 py-2 text-[13.5px] outline-none" style={{ background: "#FBF8F0", border: `1px solid ${HAIRLINE}`, color: INK }}>
                        {f.options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                    ) : (
                      <input type={f.type === "number" ? "number" : "text"} value={form[f.key] ?? f.default} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="mt-1 w-full rounded-[6px] px-3 py-2 text-[13.5px] outline-none" style={{ background: "#FBF8F0", border: `1px solid ${HAIRLINE}`, color: INK }} />
                    )}
                  </div>
                ))}
              </div>
              <GoldButton type="submit" className="w-full flex items-center justify-center mt-2">
                Add {cfg.entitySingular.toLowerCase()}
              </GoldButton>
            </form>
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setPreview(null)}>
          <div onClick={(e) => e.stopPropagation()} className="rounded-[10px] w-full max-w-[340px] p-5" style={{ background: CARD, boxShadow: "0 24px 60px rgba(60,45,10,0.22)" }}>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle size={15} style={{ color: STATUS.good.c }} />
              <div className="text-[13.5px] font-medium" style={{ color: INK }}>WhatsApp message</div>
            </div>
            <div className="rounded-[8px] p-3.5 text-[13px] leading-relaxed" style={{ background: "#FBF8F0", border: `1px solid ${HAIRLINE}`, color: "#4A4432" }}>
              {cfg.reminderMsg(preview, bizName || cfg.label)}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setPreview(null)} className="flex-1 text-[13px] rounded-[6px] py-2 transition-colors" style={{ color: "#4A4432", border: `1px solid ${HAIRLINE}` }}>Cancel</button>
              <button onClick={confirmSend} className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-medium rounded-[6px] py-2 transition-colors" style={{ background: STATUS.good.c, color: "#FBF6EA" }}>
                <Check size={14} strokeWidth={2.5} />Send
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 left-5 sm:left-auto text-[13px] font-medium px-4 py-3 rounded-[7px] z-50 flex items-center gap-2 sm:max-w-[300px]"
          style={{ background: INK, color: "#F4EEDF", boxShadow: "0 12px 32px rgba(0,0,0,0.28)" }}>
          <Check size={15} strokeWidth={2.5} style={{ color: "#8FCB9C" }} className="shrink-0" /><span className="truncate">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default OneLedgerCream;
