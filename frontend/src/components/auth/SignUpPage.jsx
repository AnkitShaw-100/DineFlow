import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground",
              card: "bg-card border border-border shadow-lg",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton:
                "border border-input bg-background hover:bg-accent text-foreground",
              formFieldLabel: "text-foreground",
              formFieldInput:
                "bg-background border border-input text-foreground placeholder:text-muted-foreground",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
          redirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
