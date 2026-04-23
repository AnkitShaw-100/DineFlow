import { createFileRoute } from "@tanstack/react-router";
import OrdersPage from "@/components/dashboard/OrdersPage";

export const Route = createFileRoute("/dashboard/orders")({
  component: OrdersPage,
});
