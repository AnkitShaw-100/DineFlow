import { createFileRoute } from "@tanstack/react-router";
import AdminPage from "@/components/dashboard/AdminPage";

export const Route = createFileRoute("/dashboard/admin")({
  component: AdminPage,
});
