import { Router } from "express";
import { meRouter } from "./me.js";
import { ordersRouter } from "./orders.js";
import { tablesRouter } from "./tables.js";
import { menuItemsRouter } from "./menuItems.js";
import { categoriesRouter } from "./categories.js";
import { dashboardRouter } from "./dashboard.js";

export const v1Router = Router();

v1Router.use(meRouter);
v1Router.use(ordersRouter);
v1Router.use(tablesRouter);
v1Router.use(menuItemsRouter);
v1Router.use(categoriesRouter);
v1Router.use(dashboardRouter);

