import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";

const orders = [
  {
    id: "#1042",
    table: "T-04",
    items: 3,
    total: 28.5,
    status: "In kitchen",
    server: "Maya",
    time: "2m",
  },
  {
    id: "#1041",
    table: "T-09",
    items: 5,
    total: 72.0,
    status: "Served",
    server: "Daniel",
    time: "8m",
  },
  {
    id: "#1040",
    table: "T-12",
    items: 6,
    total: 184.0,
    status: "Paid",
    server: "Lucia",
    time: "14m",
  },
  {
    id: "#1039",
    table: "T-02",
    items: 2,
    total: 22.0,
    status: "New",
    server: "Maya",
    time: "just now",
  },
  {
    id: "#1038",
    table: "T-07",
    items: 4,
    total: 56.4,
    status: "Paid",
    server: "Daniel",
    time: "22m",
  },
  {
    id: "#1037",
    table: "T-11",
    items: 3,
    total: 41.2,
    status: "In kitchen",
    server: "Lucia",
    time: "25m",
  },
  {
    id: "#1036",
    table: "T-05",
    items: 2,
    total: 18.0,
    status: "Cancelled",
    server: "Maya",
    time: "31m",
  },
];

const tabs = ["All", "New", "In kitchen", "Served", "Paid"];

const statusColor = {
  New: "bg-highlight text-highlight-foreground",
  "In kitchen": "bg-terracotta/15 text-terracotta",
  Served: "bg-mint text-primary",
  Paid: "bg-primary text-primary-foreground",
  Cancelled: "bg-destructive/15 text-destructive",
};

export default function OrdersPage() {
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");

  const filtered = orders.filter(
    (o) =>
      (tab === "All" || o.status === tab) &&
      (q === "" ||
        o.id.includes(q) ||
        o.table.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Orders</h1>
          <p className="mt-1 text-muted-foreground">
            Track every ticket from new to paid.
          </p>
        </div>

        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-1 h-4 w-4" /> New order
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by order # or table"
              className="pl-9"
            />
          </div>

          <Button variant="outline" size="sm">
            <Filter className="mr-1 h-4 w-4" /> Filter
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Table</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Server</th>
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {filtered.map((o) => (
              <tr key={o.id} className="transition-colors hover:bg-muted/40">
                <td className="px-5 py-4 font-semibold">{o.id}</td>
                <td className="px-5 py-4">{o.table}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {o.items} items
                </td>
                <td className="px-5 py-4">{o.server}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {o.time}
                </td>
                <td className="px-5 py-4 font-semibold">
                  ${o.total.toFixed(2)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusColor[o.status]
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-muted-foreground"
                >
                  No orders match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
