import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import LandingPage from "./components/landing/LandingPage.jsx";
import SignInPage from "./components/auth/SignInPage.jsx";
import SignUpPage from "./components/auth/SignUpPage.jsx";
import DashboardHome from "./components/dashboard/DashboardHome.jsx";
import OrdersPage from "./components/dashboard/OrdersPage.jsx";
import TablesPage from "./components/dashboard/TablesPage.jsx";
import AdminPage from "./components/dashboard/AdminPage.jsx";
import { AppSidebar } from "./components/dashboard/AppSidebar.jsx";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar.jsx";
import { UserButton, SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import appCss from "./styles.css?url";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ErrorBoundary({ error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        {import.meta.env.DEV && error.message && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-muted p-3 text-left font-mono text-xs text-destructive">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function RootLayout() {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-lg rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-card">
          <h1 className="font-display text-3xl font-bold">Almost there</h1>
          <p className="mt-3 text-muted-foreground">
            Add your Clerk publishable key as the environment variable{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              VITE_CLERK_PUBLISHABLE_KEY
            </code>{" "}
            to enable sign-in and sign-up. You can find it in your Clerk dashboard under{" "}
            <strong>API Keys</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Outlet />
    </ClerkProvider>
  );
}

function DashboardLayout() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/sign-in");
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
                  <span className="font-display text-lg font-semibold">
                    Dine Flow
                  </span>
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary error={new Error("Page not found")} />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "sign-in",
        element: <SignInPage />,
      },
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
          },
          {
            path: "tables",
            element: <TablesPage />,
          },
          {
            path: "admin",
            element: <AdminPage />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

