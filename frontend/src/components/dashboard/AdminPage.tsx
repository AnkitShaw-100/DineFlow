import { useUser } from "@clerk/clerk-react";
import { ShieldCheck, Users, Settings, Database, Bell } from "lucide-react";

const team = [
  { name: "Maya Okafor", role: "Owner", email: "maya@dineflow.app", status: "Online" },
  { name: "Daniel Park", role: "Manager", email: "daniel@dineflow.app", status: "Online" },
  { name: "Lucia Romero", role: "Server", email: "lucia@dineflow.app", status: "Off shift" },
  { name: "Theo Albright", role: "Chef", email: "theo@dineflow.app", status: "Online" },
];

export default function AdminPage() {
  const { user } = useUser();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold">Admin</h1>
          <p className="text-muted-foreground">Manage your restaurant settings and team.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Team</h2>
            </div>
            <button className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Invite
            </button>
          </div>
          <div className="mt-4 divide-y divide-border">
            {team.map((m) => (
              <div key={m.email} className="flex items-center gap-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint font-semibold text-primary">
                  {m.name[0]}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.email}</div>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{m.role}</span>
                <span
                  className={`text-xs font-medium ${
                    m.status === "Online" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  ● {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Account</h2>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Signed in as</dt>
                <dd className="font-medium">{user?.primaryEmailAddress?.emailAddress ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Plan</dt>
                <dd className="font-medium">Pro · $89/mo</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Locations</dt>
                <dd className="font-medium">1 active</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-primary p-6 text-primary-foreground shadow-soft">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h2 className="font-display text-xl font-semibold">Service alerts</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/90">
              <li className="flex items-start gap-2">
                <Database className="mt-0.5 h-4 w-4 flex-shrink-0" />
                Daily backup completed at 3:00 AM
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                All registers connected and healthy
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
