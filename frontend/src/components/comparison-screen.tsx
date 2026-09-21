import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, CheckCircle2, Clock3, FileText, Flag, RefreshCw, Save, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { emailPresentation } from "@/data/averis-data";
import type { ClassifiedEmail, ComparisonField } from "@/types/averis";

const labels: Record<string, string> = { shipper: "Shipper", consignee: "Consignee", notify_party: "Notify party", port_of_loading: "Port of loading", port_of_discharge: "Port of discharge", container_count: "Container count", gross_weight_kg: "Gross weight (kg)" };

function group(field: ComparisonField) {
  if (["shipper", "port_of_loading", "port_of_discharge"].includes(field.field)) return "General Information";
  if (["consignee", "notify_party"].includes(field.field)) return "Consignee & Parties";
  return "Cargo & Packaging";
}

export function ComparisonScreen({ email }: { email: ClassifiedEmail }) {
  const [flagged, setFlagged] = useState(email.needs_review);
  const [resolved, setResolved] = useState(false);
  const [notes, setNotes] = useState("");
  const details = emailPresentation[email.email_id];
  const fields = email.comparison?.fields ?? [];
  const groups = ["General Information", "Consignee & Parties", "Cargo & Packaging"];
  const mismatches = fields.filter((field) => !field.match).length;
  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-3"><Link to="/" aria-label="Back to inbox" className="text-muted-foreground"><ArrowLeft size={18} /></Link><h1 className="text-xl font-extrabold">Comparison Detail: {details?.subject.split(" · ")[0] ?? email.email_id}</h1></div><div className="ml-8 mt-2 flex items-center gap-4 text-[10px] font-bold uppercase text-muted-foreground"><span>Priority: {email.status === "escalated" ? "High" : "Normal"}</span><span className="flex items-center gap-1 normal-case"><Clock3 size={12} />Last analyzed 4m ago</span></div></div><div className="flex flex-wrap gap-2"><Button size="sm" onClick={() => setFlagged(!flagged)} variant={flagged ? "primary" : "outline"}><Flag size={14} />{flagged ? "Flagged" : "Flag for Review"}</Button><Button size="sm" disabled={!email.comparison}><RefreshCw size={14} />Update from SI</Button><Button size="sm" variant="primary" disabled={!email.comparison} onClick={() => setResolved(true)}><ShieldCheck size={14} />{resolved ? "Resolved" : "Resolve All"}</Button></div></div>
      {(mismatches > 0 || email.review_reason) && <div className="mt-5 flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-destructive"><AlertCircle size={18} className="mt-0.5 shrink-0" /><div><p className="text-sm font-extrabold">Action Required: Document Mismatches Detected</p><p className="mt-1 text-xs">{email.review_reason?.message ?? `We found ${mismatches} critical discrepancy between the Shipping Instruction and Bill of Lading.`}</p></div></div>}
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.85fr)]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            {email.comparison ? <table className="w-full border-collapse text-left"><thead className="bg-muted/60 text-[10px] uppercase text-muted-foreground"><tr><th className="px-4 py-4">Field name</th><th className="px-4 py-4">Shipping Instruction (SI)</th><th className="px-4 py-4">Bill of Lading (BL)</th><th className="w-12 px-4 py-4" /></tr></thead><tbody>{fields.length ? groups.map((section) => <GroupRows key={section} title={section} rows={fields.filter((field) => group(field) === section)} resolved={resolved} />) : <tr><td colSpan={4} className="px-5 py-14 text-center"><CheckCircle2 className="mx-auto text-success" /><p className="mt-3 font-bold">No mismatch detected.</p><p className="mt-1 text-sm text-muted-foreground">The SI and BL fields match.</p></td></tr>}</tbody></table> : <div className="px-6 py-16 text-center"><FileText className="mx-auto text-muted-foreground" /><p className="mt-3 font-bold">Comparison unavailable</p><p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{email.review_reason?.message}</p></div>}
          </div>
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm"><h2 className="text-sm font-extrabold">Internal Resolution Notes</h2><p className="mt-1 text-xs text-muted-foreground">Document all overrides or verification steps taken for compliance auditing.</p><textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-4 min-h-28 w-full resize-none rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-primary" placeholder="Enter verification notes here..." /><div className="mt-3 flex justify-end"><Button size="sm" disabled={!notes.trim()}><Save size={14} />Save Note</Button></div></div>
        </div>
        <aside className="space-y-4"><div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"><div className="flex items-center justify-between border-b border-border px-4 py-3"><b className="text-xs">Original BL Scan</b><span className="rounded bg-muted px-2 py-1 text-[9px] font-extrabold uppercase">Verified PDF</span></div><div className="relative flex aspect-[4/5] flex-col justify-between bg-muted p-7"><div className="space-y-4"><div className="h-4 w-32 rounded bg-border" /><div className="h-2 w-full rounded bg-border" /><div className="h-2 w-4/5 rounded bg-border" /></div><div className="rounded-lg border-2 border-dashed border-primary/40 bg-card/70 p-5"><p className="text-center text-xs font-extrabold text-muted-foreground">BILL OF LADING</p><div className="mt-5 grid grid-cols-2 gap-3">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-2 rounded bg-border" />)}</div></div><div className="text-center text-[10px] text-muted-foreground">Document preview · Page 1 of 1</div></div></div><div className="rounded-lg border border-border bg-card p-4 shadow-sm"><p className="flex items-center gap-2 text-[10px] font-extrabold uppercase text-muted-foreground"><ShieldCheck size={14} />Validation context</p><dl className="mt-4 space-y-3 text-xs"><div className="flex justify-between"><dt>OCR Confidence Score</dt><dd className="font-extrabold text-success">{(email.confidence * 100).toFixed(1)}%</dd></div><div className="flex justify-between"><dt>Source File Type</dt><dd className="font-semibold">PDF/A (Scanned)</dd></div><div className="flex justify-between"><dt>Template Matched</dt><dd className="font-semibold">Standard_BL_V4</dd></div></dl></div></aside>
      </div>
    </section>
  );
}

function GroupRows({ title, rows, resolved }: { title: string; rows: ComparisonField[]; resolved: boolean }) {
  if (!rows.length) return null;
  return <><tr className="border-t border-border bg-muted/35"><td colSpan={4} className="px-4 py-2 text-[9px] font-extrabold uppercase text-muted-foreground">{title}</td></tr>{rows.map((field) => { const matched = field.match || resolved; return <tr key={field.field} className={`border-t border-border ${matched ? "" : "bg-destructive/5"}`}><td className="px-4 py-4 text-[10px] font-bold uppercase text-muted-foreground">{labels[field.field] ?? field.field.replaceAll("_", " ")}</td><td className="px-4 py-4 font-mono text-xs font-semibold">{field.si_value}</td><td className="px-4 py-4"><span className={`rounded-md px-2 py-1 font-mono text-xs font-semibold ${matched ? "" : "bg-destructive/10 text-destructive"}`}>{resolved ? field.si_value : field.bl_value}</span></td><td className="px-4 py-4">{matched ? <CheckCircle2 size={16} className="text-success" /> : <XCircle size={16} className="text-destructive" />}</td></tr>; })}</>;
}