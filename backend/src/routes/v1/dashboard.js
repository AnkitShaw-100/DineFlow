import { Router } from "express";
import { z } from "zod";
import { requireAuthApi } from "../../middlewares/requireAuthApi.js";
import { ensureDbUser } from "../../middlewares/ensureDbUser.js";
import { Order } from "../../models/Order.js";
import { Table } from "../../models/Table.js";
import { ChecklistItem } from "../../models/ChecklistItem.js";

export const dashboardRouter = Router();

function getClerkUserId(req) {
  const userId =
    req?.auth && typeof req.auth.userId === "string" ? req.auth.userId : null;
  if (!userId) throw new Error("Missing auth userId");
  return userId;
}

dashboardRouter.get(
  "/dashboard/summary",
  requireAuthApi(),
  ensureDbUser(),
  async (req, res, next) => {
    try {
      const clerkUserId = getClerkUserId(req);
      const page = Math.max(
        1,
        z.coerce.number().int().positive().optional().parse(req.query.page ?? 1),
      );
      const limit = Math.min(
        20,
        Math.max(
          1,
          z.coerce.number().int().positive().optional().parse(req.query.limit ?? 5),
        ),
      );

      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const [todayRevenueAgg, openOrders, totalTables, occupiedTables, avgTicketAgg] =
        await Promise.all([
          Order.aggregate([
            {
              $match: {
                createdByClerkUserId: clerkUserId,
                createdAt: { $gte: start, $lt: end },
                paymentStatus: "paid",
              },
            },
            { $group: { _id: null, total: { $sum: "$subtotal" } } },
          ]),
          Order.countDocuments({
            createdByClerkUserId: clerkUserId,
            status: { $nin: ["Paid", "Cancelled"] },
          }),
          Table.countDocuments(),
          Table.countDocuments({ status: { $in: ["seated", "billed"] } }),
          Order.aggregate([
            {
              $match: {
                createdByClerkUserId: clerkUserId,
                createdAt: { $gte: start, $lt: end },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$subtotal" },
                count: { $sum: 1 },
              },
            },
          ]),
        ]);

      const recentOrdersTotal = await Order.countDocuments({
        createdByClerkUserId: clerkUserId,
      });

      const recentOrders = await Order.find({ createdByClerkUserId: clerkUserId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const checklist = await ChecklistItem.find({ clerkUserId })
        .sort({ createdAt: 1 })
        .lean();

      const todayRevenue = todayRevenueAgg[0]?.total ?? 0;
      const avgTicket =
        (avgTicketAgg[0]?.count ?? 0) > 0
          ? (avgTicketAgg[0]?.total ?? 0) / avgTicketAgg[0].count
          : 0;

      res.json({
        stats: {
          todayRevenue,
          openOrders,
          tablesSeated: occupiedTables,
          totalTables,
          avgTicket,
        },
        recentOrders: recentOrders.map((o) => ({
          id: String(o._id),
          table: o.tableCode,
          itemsText: (o.items ?? [])
            .map((it) => `${it.name} x${it.qty}`)
            .slice(0, 3)
            .join(" · "),
          total: o.subtotal,
          status: o.status,
          time: o.createdAt,
        })),
        recentOrdersPagination: {
          page,
          limit,
          total: recentOrdersTotal,
          totalPages: Math.max(1, Math.ceil(recentOrdersTotal / limit)),
        },
        checklist: checklist.map((c) => ({
          id: String(c._id),
          title: c.title,
          done: c.done,
        })),
      });
    } catch (err) {
      next(err);
    }
  },
);

dashboardRouter.post(
  "/dashboard/checklist",
  requireAuthApi(),
  ensureDbUser(),
  async (req, res, next) => {
    try {
      const clerkUserId = getClerkUserId(req);
      const body = z.object({ title: z.string().min(1) }).parse(req.body);
      const created = await ChecklistItem.create({
        clerkUserId,
        title: body.title.trim(),
        done: false,
      });
      res.status(201).json({
        item: { id: String(created._id), title: created.title, done: created.done },
      });
    } catch (err) {
      next(err);
    }
  },
);

dashboardRouter.patch(
  "/dashboard/checklist/:id",
  requireAuthApi(),
  ensureDbUser(),
  async (req, res, next) => {
    try {
      const clerkUserId = getClerkUserId(req);
      const body = z.object({ done: z.boolean() }).parse(req.body);
      const updated = await ChecklistItem.findOneAndUpdate(
        { _id: req.params.id, clerkUserId },
        { $set: { done: body.done } },
        { new: true },
      ).lean();

      if (!updated) return res.status(404).json({ error: { message: "Not found" } });
      res.json({
        item: { id: String(updated._id), title: updated.title, done: updated.done },
      });
    } catch (err) {
      next(err);
    }
  },
);

