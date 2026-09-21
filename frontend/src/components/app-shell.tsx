import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, FileCheck2, Inbox, Search, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col border-r border-border bg-card px-2 py-5 md:w-56 md:px-4">
        <Link to="/" className="mb-8 flex h-9 items-center gap-3 px-1 md:px-2" aria-label="Averis inbox">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><FileCheck2 size={18} /></span>
          <span className="hidden text-lg font-extrabold md:block">Averis</span>
        </Link>
        <nav className="space-y-2">
          <Link to="/" activeOptions={{ exact: true }} className={cn("flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold text-muted-foreground", pathname === "/" && "bg-muted text-foreground")}>
            <Inbox size={18} /><span className="hidden md:inline">Inbox</span>
          </Link>
          <Link to="/review" className={cn("flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold text-muted-foreground", pathname === "/review" && "bg-muted text-foreground")}>
            <ShieldCheck size={18} /><span className="hidden md:inline">Review</span>
          </Link>
        </nav>
        <div className="mt-auto hidden rounded-lg border border-border bg-background p-3 md:block">
          <p className="text-[10px] font-extrabold uppercase text-muted-foreground">System status</p>
          <p className="mt-2 flex items-center gap-2 text-xs font-medium"><span className="size-2 rounded-full bg-success" />Operational</p>
        </div>
      </aside>
      <div className="ml-16 md:ml-56">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/95 px-5 backdrop-blur lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>Dashboard</span><span>/</span><span className="text-foreground">Verify Documents</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="hidden h-9 w-56 items-center gap-2 rounded-md border border-border bg-background px-3 text-muted-foreground sm:flex">
              <Search size={15} /><input className="w-full bg-transparent text-xs outline-none" placeholder="Search documents..." />
            </label>
            <Bell size={18} className="text-muted-foreground" />
            <span className="flex size-8 items-center justify-center rounded-full bg-info-soft text-xs font-bold text-info">AM</span>
            <ChevronDown size={14} className="text-muted-foreground" />
          </div>
        </header>
        <main className="mx-auto max-w-[1480px] p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}