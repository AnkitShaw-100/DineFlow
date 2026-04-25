import { Router } from "express";
import { z } from "zod";
import { requireAuthApi } from "../../middlewares/requireAuthApi.js";
import { Order } from "../../models/Order.js";
export const ordersRouter = Router();
ordersRouter.get("/orders", requireAuthApi(), async (req, res, next) => {
    try {
        const status = z
            .enum(["New", "In kitchen", "Served", "Paid", "Cancelled"])
            .optional()
            .safeParse(req.query.status);
        const q = z.string().trim().optional().safeParse(req.query.q);
        const filter = {};
        if (status.success && status.data)
            filter.status = status.data;
        if (q.success && q.data) {
            const query = q.data;
            filter.$or = [
                { tableCode: { $regex: query, $options: "i" } },
                { orderNo: Number.isFinite(Number(query)) ? Number(query) : -1 },
            ];
        }
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .limit(200)
            .lean();
        res.json({
            orders: orders.map((o) => ({
                id: `#${o.orderNo}`,
                table: o.tableCode,
                items: o.items.reduce((acc, it) => acc + it.qty, 0),
                total: o.subtotal,
                status: o.status,
                server: o.serverName ?? "—",
                time: o.createdAt,
            })),
        });
    }
    catch (err) {
        next(err);
    }
});
const CreateOrderSchema = z.object({
    tableCode: z.string().min(1),
    serverName: z.string().min(1).optional(),
    items: z
        .array(z.object({
        name: z.string().min(1),
        qty: z.number().int().positive(),
        price: z.number().nonnegative(),
    }))
        .min(1),
});
ordersRouter.post("/orders", requireAuthApi(), async (req, res, next) => {
    try {
        const parsed = CreateOrderSchema.parse(req.body);
        const subtotal = parsed.items.reduce((acc, it) => acc + it.qty * it.price, 0);
        const last = await Order.findOne()
            .sort({ orderNo: -1 })
            .select({ orderNo: 1 })
            .lean();
        const nextOrderNo = (last?.orderNo ?? 1030) + 1;
        const created = await Order.create({
            orderNo: nextOrderNo,
            tableCode: parsed.tableCode,
            serverName: parsed.serverName,
            items: parsed.items,
            subtotal,
            status: "New",
        });
        res.status(201).json({ order: created });
    }
    catch (err) {
        next(err);
    }
});
