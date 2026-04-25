import { Router } from "express";
import { meRouter } from "./me.js";
import { ordersRouter } from "./orders.js";
import { tablesRouter } from "./tables.js";
export const v1Router = Router();
v1Router.use(meRouter);
v1Router.use(ordersRouter);
v1Router.use(tablesRouter);
