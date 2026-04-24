import { Users, Clock } from "lucide-react";

const tables = [
  { id: "T-01", seats: 2, status: "available" },
  { id: "T-02", seats: 2, status: "seated", guests: 2, duration: "0:18" },
  { id: "T-03", seats: 4, status: "available" },
  { id: "T-04", seats: 4, status: "seated", guests: 3, duration: "0:42" },
  { id: "T-05", seats: 4, status: "cleaning" },
  { id: "T-06", seats: 6, status: "billed", guests: 5, duration: "1:24" },
  { id: "T-07", seats: 2, status: "seated", guests: 2, duration: "0:32" },
  { id: "T-08", seats: 4, status: "available" },
  { id: "T-09", seats: 6, status: "seated", guests: 4, duration: "1:05" },
  { id: "T-10", seats: 2, status: "available" },
  { id: "T-11", seats: 4, status: "seated", guests: 3, duration: "0:24" },
  { id: "T-12", seats: 8, status: "billed", guests: 6, duration: "1:48" },
];

const statusMeta = {
  available: {
    label: "Available",
    bg: "bg-card",
    ring: "ring-border",
    dot: "bg-mint",
  },
  seated: {
    label: "Seated",
    bg: "bg-primary text-primary-foreground",
    ring: "ring-primary",
    dot: "bg-highlight",
  },
  billed: {
    label: "Billed",
    bg: "bg-highlight text-highlight-foreground",
    ring: "ring-highlight",
    dot: "bg-primary",
  },
  cleaning: {
    label: "Cleaning",
    bg: "bg-muted text-muted-foreground",
    ring: "ring-border",
    dot: "bg-terracotta",
  },
};

export default function TablesPage() {
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

        <div className="flex gap-2">
          {Object.keys(statusMeta).map((s) => (
            <div
              key={s}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium"
            >
              <span className={`h-2 w-2 rounded-full ${statusMeta[s].dot}`} />
              {statusMeta[s].label}
              <span className="text-muted-foreground">
                ({counts[s] || 0})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tables.map((t) => {
            const meta = statusMeta[t.status];

            return (
              <button
                key={t.id}
                className={`group relative flex flex-col items-start gap-3 rounded-2xl p-5 text-left ring-1 transition-all hover:-translate-y-0.5 hover:shadow-card ${meta.bg} ${meta.ring}`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-display text-2xl font-bold">
                    {t.id}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                </div>

                <div className="flex items-center gap-1.5 text-xs opacity-80">
                  <Users className="h-3.5 w-3.5" />
                  {t.guests
                    ? `${t.guests}/${t.seats}`
                    : `${t.seats} seats`}
                </div>

                {t.duration && (
                  <div className="flex items-center gap-1.5 text-xs opacity-80">
                    <Clock className="h-3.5 w-3.5" />
                    {t.duration}
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
    </div>
  );
}
