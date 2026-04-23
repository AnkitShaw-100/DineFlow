import { useUser } from "@clerk/clerk-react";
import { ClipboardList, DollarSign, LayoutGrid, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

const stats = [
  { label: "Today's revenue", value: "$4,820", delta: "+18%", icon: DollarSign },
  { label: "Open orders", value: "12", delta: "3 new", icon: ClipboardList },
  { label: "Tables seated", value: "9 / 16", delta: "56% full", icon: LayoutGrid },
  { label: "Avg ticket", value: "$48.20", delta: "+4%", icon: TrendingUp },
];

const recentOrders = [
  { table: "T-04", items: "Burger combo · Soda", total: "$28.50", status: "In kitchen", time: "2m" },
  { table: "T-09", items: "Pasta · Tiramisu · Wine", total: "$72.00", status: "Served", time: "8m" },
  { table: "T-12", items: "Tasting menu × 2", total: "$184.00", status: "Paid", time: "14m" },
  { table: "T-02", items: "Salad · Sparkling water", total: "$22.00", status: "New", time: "just now" },
];

const statusColor: Record<string, string> = {
  New: "bg-highlight text-highlight-foreground",
  "In kitchen": "bg-terracotta/15 text-terracotta",
  Served: "bg-mint text-primary",
  Paid: "bg-primary text-primary-foreground",
};

export default function DashboardHome() {
  const { user } = useUser();
  const first = user?.firstName ?? "there";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Welcome back, {first} 👋</h1>
        <p className="mt-1 text-muted-foreground">Here's how service is running tonight.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint text-primary">
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 font-display text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs font-medium text-primary">{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recent orders</h2>
            <button className="text-sm font-medium text-primary hover:underline">View all</button>
          </div>
          <div className="mt-4 divide-y divide-border">
            {recentOrders.map((o) => (
              <div key={o.table + o.time} className="flex items-center gap-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted font-display font-bold">
                  {o.table}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{o.items}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> {o.time}
                  </div>
                </div>
                <div className="text-sm font-semibold">{o.total}</div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[o.status]}`}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold">Tonight's checklist</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { t: "Open registers", done: true },
              { t: "Print prep tickets", done: true },
              { t: "Confirm 7pm reservations", done: false },
              { t: "Stock bar with limes", done: false },
              { t: "Close out shift reports", done: false },
            ].map((c) => (
              <li key={c.t} className="flex items-center gap-3">
                <CheckCircle2
                  className={`h-5 w-5 ${c.done ? "text-primary" : "text-muted-foreground/40"}`}
                />
                <span className={c.done ? "text-muted-foreground line-through" : ""}>{c.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
