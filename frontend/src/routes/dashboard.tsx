import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { UserButton } from "@clerk/clerk-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: "/sign-in/$", params: { _splat: "" } });
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <>
      <SignedOut>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-muted-foreground">Redirecting to sign in…</p>
        </div>
      </SignedOut>
      <SignedIn>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
              <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <SidebarTrigger />
                  <span className="font-display text-lg font-semibold">Dine Flow</span>
                </div>
                <UserButton afterSignOutUrl="/" />
              </header>
              <main className="flex-1 p-6">
                <Outlet />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </SignedIn>
    </>
  );
}
