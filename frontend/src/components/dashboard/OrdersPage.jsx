import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Filter, Minus, Clock3 } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { useAuth } from "@clerk/clerk-react";
import { apiFetch } from "../../lib/apiClient.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.jsx";

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
  const [page, setPage] = useState(1);
  const { getToken } = useAuth();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [tableCode, setTableCode] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [orderStatus, setOrderStatus] = useState("New");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const token = await getToken();
        const params = new URLSearchParams();
        if (tab !== "All") params.set("status", tab);
        if (q.trim()) params.set("q", q.trim());
        params.set("page", String(page));
        params.set("limit", "8");

        const data = await apiFetch(`/v1/orders?${params.toString()}`, { token });
        if (!cancelled) {
          setOrders(data.orders ?? []);
          setPagination(
            data.pagination ?? { page: 1, limit: 8, total: 0, totalPages: 1 },
          );
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [getToken, tab, q, page]);

  useEffect(() => {
    setPage(1);
  }, [tab, q]);

  const filtered = useMemo(() => orders, [orders]);

  const subtotal = useMemo(
    () => cart.reduce((acc, it) => acc + it.qty * it.price, 0),
    [cart],
  );

  async function loadFormData(nextTableCode = "") {
    const token = await getToken();
    const [t, m] = await Promise.all([
      apiFetch("/v1/tables", { token }),
      apiFetch("/v1/menu-items?active=true", { token }),
    ]);

    const tList = t.tables ?? [];
    setTables(tList);
    setMenuItems(m.items ?? []);

    if (nextTableCode) {
      setTableCode(nextTableCode);
    } else if (!tableCode && tList.length > 0) {
      setTableCode(tList[0].id);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Orders</h1>
          <p className="mt-1 text-muted-foreground">
            Track every ticket from new to paid.
          </p>
        </div>

        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={async () => {
            try {
              setError("");
              await loadFormData();
              setCart([]);
              setSelectedItemId("");
              setSelectedQty(1);
              setPaymentStatus("unpaid");
              setOrderStatus("New");
              setCreateOpen(true);
            } catch (e) {
              setError(e?.message || "Failed to load order form");
            }
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> New order
        </Button>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4">
            <h2 className="font-display text-xl font-semibold">Create order</h2>
            <p className="text-sm text-muted-foreground">
              Select a table and add items from your menu.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="text-sm font-medium">Table</div>
              <Select value={tableCode} onValueChange={setTableCode}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                {tables.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                    {t.id} ({t.seats} seats)
                    </SelectItem>
                ))}
                </SelectContent>
              </Select>
              {tables.length === 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  No tables found. Create tables in the Tables page first.
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-sm font-medium">Add item</div>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select menu item" />
                    </SelectTrigger>
                    <SelectContent>
                    {menuItems.map((it) => (
                        <SelectItem key={it._id} value={it._id}>
                        {it.name} {it.category ? `· ${it.category}` : ""} · ₹
                        {Number(it.price).toFixed(0)}
                        </SelectItem>
                    ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 items-center justify-end">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-10 text-center text-sm font-semibold">
                    {selectedQty}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedQty((q) => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    disabled={
                      !selectedItemId || !Number.isFinite(Number(selectedQty))
                    }
                    onClick={() => {
                      const it = menuItems.find((x) => x._id === selectedItemId);
                      if (!it) return;
                      const qty = Number(selectedQty);
                      setCart((prev) => {
                        const existing = prev.find((p) => p._id === it._id);
                        if (existing) {
                          return prev.map((p) =>
                            p._id === it._id ? { ...p, qty: p.qty + qty } : p,
                          );
                        }
                        return [
                          ...prev,
                          { _id: it._id, name: it.name, price: it.price, qty },
                        ];
                      });
                      setSelectedItemId("");
                      setSelectedQty(1);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Items</div>
                <div className="text-sm font-semibold">₹{subtotal.toFixed(2)}</div>
              </div>

              <div className="mt-3 space-y-2">
                {cart.map((it) => (
                  <div
                    key={it._id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{it.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ₹{Number(it.price).toFixed(2)} × {it.qty}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">
                        ₹{(it.price * it.qty).toFixed(2)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCart((prev) => prev.filter((p) => p._id !== it._id))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No items added yet.
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium">Order status</div>
                  <Select value={orderStatus} onValueChange={setOrderStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select order status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["New", "In kitchen", "Served", "Paid", "Cancelled"].map(
                        (s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-sm font-medium">Payment status</div>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["unpaid", "pending", "paid", "failed"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!tableCode || cart.length === 0}
              onClick={async () => {
                try {
                  setError("");
                  const token = await getToken();
                  const data = await apiFetch("/v1/orders", {
                    token,
                    method: "POST",
                    body: {
                      tableCode,
                      items: cart.map((c) => ({
                        name: c.name,
                        qty: c.qty,
                        price: Number(c.price),
                      })),
                      status: orderStatus,
                      paymentStatus,
                    },
                  });
                  setCreateOpen(false);
                } catch (e) {
                  setError(e?.message || "Failed to place order");
                }
              }}
            >
              Place order
            </Button>
          </div>
        </div>
        </div>
      )}

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
        <div className="mt-3 text-xs text-muted-foreground">
          Showing up to 8 orders per page
        </div>
      </div>

      <div
        className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card ${
          filtered.length >= 8 ? "lg:min-h-[34rem]" : "lg:min-h-[28rem]"
        }`}
      >
        <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Table</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Server</th>
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Manager update</th>
              <th className="px-5 py-3">Payment</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Updated</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {filtered.map((o) => (
              <tr key={o.orderId || o.id} className="transition-colors hover:bg-muted/40">
                <td className="px-5 py-4 font-semibold">{o.id}</td>
                <td className="px-5 py-4">{o.table}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {o.items} items
                </td>
                <td className="px-5 py-4">{o.server}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {o.time ? new Date(o.time).toLocaleTimeString() : "—"}
                </td>
                <td className="px-5 py-4 font-semibold">
                  ${o.total.toFixed(2)}
                </td>
                <td className="px-5 py-4 min-w-[240px]">
                  <div className="flex gap-2">
                    <Select
                      value={o.status}
                      onValueChange={async (value) => {
                        try {
                          const token = await getToken();
                          const data = await apiFetch(
                            `/v1/orders/${o.orderId}/state`,
                            {
                              token,
                              method: "PATCH",
                              body: { status: value },
                            },
                          );
                          setOrders((prev) =>
                            prev.map((x) =>
                              x.orderId === o.orderId
                                ? {
                                    ...x,
                                    status: data.order.status,
                                    statusUpdatedAt: data.order.statusUpdatedAt,
                                  }
                                : x,
                            ),
                          );
                        } catch (e) {
                          setError(e?.message || "Failed to update order status");
                        }
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["New", "In kitchen", "Served", "Paid", "Cancelled"].map(
                          (s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>

                    <Select
                      value={o.paymentStatus}
                      onValueChange={async (value) => {
                        try {
                          const token = await getToken();
                          const data = await apiFetch(
                            `/v1/orders/${o.orderId}/state`,
                            {
                              token,
                              method: "PATCH",
                              body: { paymentStatus: value },
                            },
                          );
                          setOrders((prev) =>
                            prev.map((x) =>
                              x.orderId === o.orderId
                                ? {
                                    ...x,
                                    paymentStatus: data.order.paymentStatus,
                                    paymentStatusUpdatedAt:
                                      data.order.paymentStatusUpdatedAt,
                                  }
                                : x,
                            ),
                          );
                        } catch (e) {
                          setError(e?.message || "Failed to update payment status");
                        }
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["unpaid", "pending", "paid", "failed"].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                    {o.paymentStatus}
                  </span>
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
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {new Date(
                      o.statusUpdatedAt || o.paymentStatusUpdatedAt || o.time,
                    ).toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-12 text-center text-muted-foreground"
                >
                  Loading orders…
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={10} className="px-5 py-12 text-center text-destructive">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-12 text-center text-muted-foreground"
                >
                  No orders match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3 text-sm">
          <div className="text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </div>
          <div className="flex gap-2">
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
              disabled={page >= pagination.totalPages}
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
