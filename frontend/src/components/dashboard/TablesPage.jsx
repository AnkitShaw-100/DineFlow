import { Users, Clock, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { apiFetch } from "../../lib/apiClient.js";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";

const statusMeta = {
  available: {
    label: "Available",
    bg: "bg-card",
    ring: "ring-border",
    dot: "bg-muted-foreground/60",
  },
  seated: {
    label: "Seated",
    bg: "bg-card",
    ring: "ring-border",
    dot: "bg-muted-foreground/60",
  },
  billed: {
    label: "Billed",
    bg: "bg-card",
    ring: "ring-border",
    dot: "bg-muted-foreground/60",
  },
  cleaning: {
    label: "Cleaning",
    bg: "bg-card",
    ring: "ring-border",
    dot: "bg-muted-foreground/60",
  },
};

export default function TablesPage() {
  const { getToken } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [code, setCode] = useState("");
  const [seats, setSeats] = useState(4);

  async function reloadTables() {
    const token = await getToken();
    const data = await apiFetch("/v1/tables", { token });
    setTables(data.tables ?? []);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const token = await getToken();
        const data = await apiFetch("/v1/tables", { token });
        if (!cancelled) setTables(data.tables ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load tables");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const counts = tables.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Tables</h1>
          <p className="mt-1 text-muted-foreground">
            Live floor plan — tap a table to manage it.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {Object.keys(statusMeta).map((s) => (
            <div
              key={s}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium"
            >
              <span className={`h-2 w-2 rounded-full ${statusMeta[s].dot}`} />
              {statusMeta[s].label}
              <span className="text-muted-foreground">({counts[s] || 0})</span>
            </div>
          ))}
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Create table
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {loading && (
            <div className="col-span-full text-center text-sm text-muted-foreground">
              Loading tables…
            </div>
          )}
          {!loading && error && (
            <div className="col-span-full text-center text-sm text-destructive">
              {error}
            </div>
          )}
          {tables.map((t) => {
            const meta = statusMeta[t.status];
            const duration =
              t.seatedAt && t.status === "seated"
                ? Math.max(0, Date.now() - new Date(t.seatedAt).getTime())
                : null;
            const mins = duration ? Math.floor(duration / 60000) : 0;
            const hrs = duration ? Math.floor(mins / 60) : 0;
            const minPart = duration ? mins % 60 : 0;
            const durationLabel =
              duration ? `${hrs}:${String(minPart).padStart(2, "0")}` : null;

            return (
              <button
                key={t.id}
                className={`group relative flex flex-col items-start gap-3 rounded-2xl p-5 text-left ring-1 transition-all hover:-translate-y-0.5 hover:shadow-card ${meta.bg} ${meta.ring}`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-display text-2xl font-bold">
                    {String(t.id).replace(/^[^\d]*/, "") || t.id}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                </div>
                <div className="text-xs opacity-70">{t.id}</div>

                <div className="flex items-center gap-1.5 text-xs opacity-80">
                  <Users className="h-3.5 w-3.5" />
                  {t.guests ? `${t.guests}/${t.seats}` : `${t.seats} seats`}
                </div>

                {durationLabel && (
                  <div className="flex items-center gap-1.5 text-xs opacity-80">
                    <Clock className="h-3.5 w-3.5" />
                    {durationLabel}
                  </div>
                )}

                <span className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-90">
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">Create table</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a table code and choose seats (max 6).
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="text-sm font-medium">Table code</div>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="T-01"
                  className="mt-1"
                />
              </div>
              <div>
                <div className="text-sm font-medium">Seats</div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="mt-2 w-full accent-primary"
                />
                <div className="mt-1 text-sm text-muted-foreground">
                  {seats} seat{seats > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={!code.trim()}
                onClick={async () => {
                  try {
                    setError("");
                    const token = await getToken();
                    await apiFetch("/v1/tables", {
                      token,
                      method: "POST",
                      body: { code: code.trim(), seats },
                    });
                    setCode("");
                    setSeats(4);
                    setCreateOpen(false);
                    await reloadTables();
                  } catch (e) {
                    setError(e?.message || "Failed to create table");
                  }
                }}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
