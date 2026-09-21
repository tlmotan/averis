import { useNavigate } from "@tanstack/react-router";
import { ArrowUpDown, CheckCircle2, Clock3, Download, Filter, Mail, MoreHorizontal, RefreshCw, Search, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { categoryLabels, emailPresentation, supplementalEmails } from "@/data/averis-data";
import { useClassifications } from "@/hooks/use-classifications";
import type { ClassifiedEmail, EmailCategory } from "@/types/averis";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/category-badge";
import { StatCard } from "@/components/stat-card";

function Confidence({ value }: { value: number }) {
  const tone = value >= .9 ? "bg-success" : value >= .7 ? "bg-warning" : "bg-destructive";
  const text = value >= .9 ? "text-success" : value >= .7 ? "text-warning" : "text-destructive";
  return <div className="w-24"><span className={`text-xs font-extrabold ${text}`}>{(value * 100).toFixed(1)}%</span><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${tone}`} style={{ width: `${value * 100}%` }} /></div></div>;
}

export function InboxScreen() {
  const navigate = useNavigate({ from: "/" });
  const data = useClassifications();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | EmailCategory>("all");
  const [showSpam, setShowSpam] = useState(false);
  const rows: ClassifiedEmail[] = [...Object.values(data), ...supplementalEmails];
  const filtered = useMemo(() => rows.filter((row) => {
    const details = emailPresentation[row.email_id];
    const haystack = `${details?.sender ?? ""} ${details?.subject ?? ""} ${details?.reference ?? ""}`.toLowerCase();
    return (showSpam || row.category !== "spam") && (category === "all" || row.category === category) && haystack.includes(query.toLowerCase());
  }), [rows, showSpam, category, query]);

  return (
    <section>
      <header><h1 className="text-2xl font-extrabold">Inbox</h1><p className="mt-1 text-sm text-muted-foreground">Manage incoming shipping documents and verify them against digital instructions.</p></header>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total received" value="1,284" icon={Mail} />
        <StatCard label="Verified auto" value="842" icon={CheckCircle2} tone="success" />
        <StatCard label="Mismatches" value="12" icon={TriangleAlert} tone="warning" />
        <StatCard label="Avg. turnaround" value="14m" icon={Clock3} tone="info" />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
        <label className="flex h-10 min-w-56 flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 text-muted-foreground"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search by sender, subject, or SI ref" /></label>
        <Button><Filter size={15} />Filters <span className="rounded-full bg-primary/10 px-1.5 text-primary">3</span></Button>
        <select value={category} onChange={(event) => setCategory(event.target.value as "all" | EmailCategory)} className="h-10 rounded-md border border-border bg-card px-3 text-sm font-semibold outline-none">
          <option value="all">All Categories</option>{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-bold"><input type="checkbox" checked={showSpam} onChange={(event) => setShowSpam(event.target.checked)} className="peer sr-only" /><span className="relative h-5 w-9 rounded-full bg-border transition-colors peer-checked:bg-primary after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-card after:transition-transform peer-checked:after:translate-x-4" />Show Spam</label>
        <Button size="icon" variant="ghost" aria-label="Refresh"><RefreshCw size={16} /></Button><Button size="icon" variant="ghost" aria-label="Sort"><ArrowUpDown size={16} /></Button>
        <Button variant="primary"><Download size={15} />Export Report</Button>
      </div>
      <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto"><table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-muted/70 text-[10px] uppercase text-muted-foreground"><tr><th className="px-5 py-4">Sender</th><th className="px-5 py-4">Subject</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Confidence</th><th className="px-5 py-4">Received</th><th className="px-5 py-4">Actions</th></tr></thead>
          <tbody>{filtered.map((row) => {
            const details = emailPresentation[row.email_id];
            const content = <><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-md bg-muted text-[10px] font-extrabold text-muted-foreground">{details?.initials}</span><span className="font-bold">{details?.sender}</span></div></td><td className="px-5 py-4"><p className="font-semibold">{details?.subject}</p><p className="mt-1 text-xs text-muted-foreground">▧&nbsp; {details?.reference}</p></td><td className="px-5 py-4"><CategoryBadge category={row.category} /></td><td className="px-5 py-4"><Confidence value={row.confidence} /></td><td className="px-5 py-4 text-muted-foreground">{details?.received}</td><td className="px-5 py-4"><MoreHorizontal size={17} className="text-muted-foreground" /></td></>;
            return row.category === "comparison_request" ? <tr key={row.email_id} role="link" tabIndex={0} aria-label={`Open comparison for ${details?.subject}`} onClick={() => navigate({ to: "/comparison/$emailId", params: { emailId: row.email_id } })} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate({ to: "/comparison/$emailId", params: { emailId: row.email_id } }); }} className="cursor-pointer border-t border-border transition-colors hover:bg-muted/40 focus:bg-muted/40 focus:outline-none">{content}</tr> : <tr key={row.email_id} className="border-t border-border">{content}</tr>;
          })}</tbody>
        </table></div>
        {filtered.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No documents match these filters.</p>}
      </div>
      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground"><span>Showing <b className="text-foreground">{filtered.length}</b> documents</span><div className="flex gap-2"><Button size="sm" disabled>Previous</Button><Button size="sm" variant="primary">1</Button><Button size="sm">Next</Button></div></div>
    </section>
  );
}