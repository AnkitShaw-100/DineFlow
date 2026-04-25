import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { apiFetch } from "../../lib/apiClient.js";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.jsx";

const defaultCategories = [
  "Starters",
  "Main Course",
  "Breads",
  "Rice & Biryani",
  "Desserts",
  "Beverages",
  "Soups",
  "Salads",
];

export default function MenuItemsPage() {
  const { getToken } = useAuth();

  const [items, setItems] = useState([]);
  const [categories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const [q, setQ] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      const token = await getToken();
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      const data = await apiFetch(`/v1/menu-items?${params.toString()}`, {
        token,
      });
      setItems(data.items ?? []);
    } catch (e) {
      setError(e?.message || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const canSubmit = useMemo(() => {
    const p = Number(price);
    return name.trim() && category && Number.isFinite(p) && p >= 0;
  }, [name, category, price]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Menu items</h1>
          <p className="mt-1 text-muted-foreground">
            Add the dishes/drinks you sell, then use them in orders.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Add item
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search menu items…"
            />
          </div>
          <Button variant="outline" onClick={load}>
            Refresh
          </Button>
        </div>

        {loading && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading…
          </div>
        )}
        {!loading && error && (
          <div className="py-10 text-center text-sm text-destructive">{error}</div>
        )}

        {!loading && !error && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <div
                key={it._id}
                className="rounded-xl border border-border bg-background p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{it.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {it.category || "Uncategorized"}
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                    ₹{Number(it.price).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                No menu items yet.
              </div>
            )}
          </div>
        )}
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">Add menu item</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter item name, category and price.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="text-sm font-medium">Item name</div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Butter chicken"
                  className="mt-1"
                />
              </div>
              <div>
                <div className="text-sm font-medium">Category</div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-sm font-medium">Price</div>
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="199"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={!canSubmit}
                onClick={async () => {
                  try {
                    setError("");
                    const token = await getToken();
                    await apiFetch("/v1/menu-items", {
                      token,
                      method: "POST",
                      body: {
                        name: name.trim(),
                        category,
                        price: Number(price),
                      },
                    });
                    setName("");
                    setCategory("");
                    setPrice("");
                    setCreateOpen(false);
                    await load();
                  } catch (e) {
                    setError(e?.message || "Failed to add item");
                  }
                }}
              >
                Add item
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

