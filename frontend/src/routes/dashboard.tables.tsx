import { createFileRoute } from "@tanstack/react-router";
import TablesPage from "@/components/dashboard/TablesPage";

export const Route = createFileRoute("/dashboard/tables")({
  component: TablesPage,
});
