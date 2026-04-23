import { createFileRoute, Link } from "@tanstack/react-router";
import { SignUp } from "@clerk/clerk-react";
import { Utensils } from "lucide-react";

export const Route = createFileRoute("/sign-up/$")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background bg-hero-gradient px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Utensils className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-bold text-foreground">Dine Flow</span>
        </Link>
        <div className="flex justify-center">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            forceRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
