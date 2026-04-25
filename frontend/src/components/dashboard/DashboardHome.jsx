import { useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  ClipboardList,
  DollarSign,
  LayoutGrid,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { apiFetch } from "../../lib/apiClient.js";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";

const statusColor = {
  New: "bg-highlight text-highlight-foreground",
  "In kitchen": "bg-terracotta/15 text-terracotta",
  Served: "bg-mint text-primary",
  Paid: "bg-primary text-primary-foreground",
};

export default function DashboardHome() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const first = user?.firstName ?? "there";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const [stats, setStats] = useState({
    todayRevenue: 0,
    openOrders: 0,
    tablesSeated: 0,
    totalTables: 0,
    avgTicket: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentMeta, setRecentMeta] = useState({ page: 1, totalPages: 1 });
  const [checklist, setChecklist] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  async function loadDashboard(nextPage = page) {
    try {
      setLoading(true);
      setError("");
      const token = await getToken();
      const data = await apiFetch(
        `/v1/dashboard/summary?page=${nextPage}&limit=5`,
        { token },
      );
      setStats(data.stats);
      setRecentOrders(data.recentOrders ?? []);
      setRecentMeta(data.recentOrdersPagination ?? { page: 1, totalPages: 1 });
      setChecklist(data.checklist ?? []);
    } catch (e) {
      setError(e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const statCards = useMemo(
    () => [
      {
        label: "Today's revenue",
        value: `₹${Number(stats.todayRevenue ?? 0).toFixed(2)}`,
        delta: "Paid orders today",
        icon: DollarSign,
      },
      {
        label: "Open orders",
        value: String(stats.openOrders ?? 0),
        delta: "Not paid/cancelled yet",
        icon: ClipboardList,
      },
      {
        label: "Tables seated",
        value: `${stats.tablesSeated ?? 0} / ${stats.totalTables ?? 0}`,
        delta: "Currently occupied",
        icon: LayoutGrid,
      },
      {
        label: "Avg ticket",
        value: `₹${Number(stats.avgTicket ?? 0).toFixed(2)}`,
        delta: "Today's average",
        icon: TrendingUp,
      },
    ],
    [stats],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Welcome back, {first} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's how service is running tonight.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-start justify-between">
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint text-primary">
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 font-display text-3xl font-bold">
              {s.value}
            </div>
            <div className="mt-1 text-xs font-medium text-primary">
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div
          className={`rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2 ${
            recentOrders.length >= 5 ? "lg:min-h-[34rem]" : "lg:min-h-[28rem]"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Recent orders
            </h2>
            <div className="text-xs text-muted-foreground">
              Page {recentMeta.page} of {recentMeta.totalPages}
            </div>
          </div>

          <div className="mt-4 divide-y divide-border">
            {loading && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Loading…
              </div>
            )}
            {!loading &&
              recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex items-center gap-4 py-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted font-display font-bold">
                  {o.table}
                </div>

                <div className="flex-1">
                  <div className="font-medium">{o.itemsText || "No items"}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />{" "}
                    {o.time ? new Date(o.time).toLocaleTimeString() : "—"}
                  </div>
                </div>

                <div className="text-sm font-semibold">
                  ₹{Number(o.total).toFixed(2)}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusColor[o.status]
                  }`}
                >
                  {o.status}
                </span>
              </div>
              ))}
            {!loading && recentOrders.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No recent orders.
              </div>
            )}
          </div>

          {(recentMeta.totalPages ?? 1) > 1 && (
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= (recentMeta.totalPages ?? 1)}
                onClick={() =>
                  setPage((p) => Math.min(recentMeta.totalPages ?? 1, p + 1))
                }
              >
                Next
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold">Manager checklist</h2>

          <div className="mt-3 flex gap-2">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task…"
            />
            <Button
              size="sm"
              disabled={!newTodo.trim()}
              onClick={async () => {
                try {
                  const token = await getToken();
                  const data = await apiFetch("/v1/dashboard/checklist", {
                    token,
                    method: "POST",
                    body: { title: newTodo.trim() },
                  });
                  setChecklist((prev) => [...prev, data.item]);
                  setNewTodo("");
                } catch (e) {
                  setError(e?.message || "Failed to add task");
                }
              }}
            >
              Add
            </Button>
          </div>

          <ul className="mt-4 space-y-3 text-sm">
            {checklist.map((c) => (
              <li key={c.id} className="flex items-center gap-3">
                <CheckCircle2
                  className={`h-5 w-5 ${
                    c.done ? "text-primary" : "text-muted-foreground/40"
                  }`}
                />
                <button
                  className={`text-left ${
                    c.done ? "text-muted-foreground line-through" : ""
                  }`}
                  onClick={async () => {
                    try {
                      const token = await getToken();
                      await apiFetch(`/v1/dashboard/checklist/${c.id}`, {
                        token,
                        method: "PATCH",
                        body: { done: !c.done },
                      });
                      setChecklist((prev) =>
                        prev.map((x) =>
                          x.id === c.id ? { ...x, done: !x.done } : x,
                        ),
                      );
                    } catch (e) {
                      setError(e?.message || "Failed to update task");
                    }
                  }}
                >
                  {c.title}
                </button>
              </li>
            ))}
            {checklist.length === 0 && (
              <li className="text-muted-foreground">No tasks yet.</li>
            )}
          </ul>
        </div>
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}
    </div>
  );
}
