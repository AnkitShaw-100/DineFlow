import { Router } from "express";
import { z } from "zod";
import { requireAuthApi } from "../../middlewares/requireAuthApi.js";
import { ensureDbUser } from "../../middlewares/ensureDbUser.js";
import { Order } from "../../models/Order.js";
import { Table } from "../../models/Table.js";

export const ordersRouter = Router();

function getClerkUserId(req) {
  const userId =
    req?.auth && typeof req.auth.userId === "string" ? req.auth.userId : null;
  if (!userId) throw new Error("Missing auth userId");
  return userId;
}

ordersRouter.get(
  "/orders",
  requireAuthApi(),
  ensureDbUser(),
  async (req, res, next) => {
  try {
    const page = Math.max(
      1,
      z.coerce.number().int().positive().optional().parse(req.query.page ?? 1),
    );
    const limit = Math.min(
      100,
      Math.max(
        1,
        z.coerce.number().int().positive().optional().parse(req.query.limit ?? 8),
      ),
    );

    const status = z
      .enum(["New", "In kitchen", "Served", "Paid", "Cancelled"])
      .optional()
      .safeParse(req.query.status);

    const q = z.string().trim().optional().safeParse(req.query.q);

    const filter = {};
    if (status.success && status.data) filter.status = status.data;

    if (q.success && q.data) {
      const query = q.data;
      const queryNum = Number(query);
      filter.$or = [
        { tableCode: { $regex: query, $options: "i" } },
        ...(Number.isFinite(queryNum) ? [{ orderNo: queryNum }] : []),
      ];
    }

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      orders: orders.map((o) => ({
        orderId: String(o._id),
        id: `#${o.orderNo}`,
        table: o.tableCode,
        items: (o.items ?? []).reduce((acc, it) => acc + it.qty, 0),
        total: o.subtotal,
        status: o.status,
        paymentStatus: o.paymentStatus ?? "unpaid",
        statusUpdatedAt: o.statusUpdatedAt ?? o.updatedAt ?? o.createdAt,
        paymentStatusUpdatedAt:
          o.paymentStatusUpdatedAt ?? o.updatedAt ?? o.createdAt,
        server: o.serverName ?? "—",
        time: o.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    next(err);
  }
});

const CreateOrderSchema = z.object({
  tableCode: z.string().min(1),
  serverName: z.string().min(1).optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        qty: z.number().int().positive(),
        price: z.number().nonnegative(),
      }),
    )
    .min(1),
  status: z
    .enum(["New", "In kitchen", "Served", "Paid", "Cancelled"])
    .optional()
    .default("New"),
  paymentStatus: z.enum(["unpaid", "pending", "paid", "failed"]).default("unpaid"),
});

ordersRouter.post(
  "/orders",
  requireAuthApi(),
  ensureDbUser(),
  async (req, res, next) => {
  try {
    const parsed = CreateOrderSchema.parse(req.body);
    const subtotal = parsed.items.reduce(
      (acc, it) => acc + it.qty * it.price,
      0,
    );

    const last = await Order.findOne()
      .sort({ orderNo: -1 })
      .select({ orderNo: 1 })
      .lean();
    const nextOrderNo = (last?.orderNo ?? 1030) + 1;

    const created = await Order.create({
      createdByClerkUserId: getClerkUserId(req),
      orderNo: nextOrderNo,
      tableCode: parsed.tableCode,
      serverName: parsed.serverName,
      items: parsed.items,
      subtotal,
      status: parsed.status,
      paymentStatus: parsed.paymentStatus,
      paidAt: parsed.paymentStatus === "paid" ? new Date() : undefined,
      statusUpdatedAt: new Date(),
      paymentStatusUpdatedAt: new Date(),
    });

    await Table.updateOne(
      { code: parsed.tableCode },
      {
        $set: {
          status: parsed.paymentStatus === "paid" ? "billed" : "seated",
        },
      },
    );

    res.status(201).json({ order: created, checkoutUrl: null });
  } catch (err) {
    next(err);
  }
});

const UpdateOrderStateSchema = z
  .object({
    status: z
      .enum(["New", "In kitchen", "Served", "Paid", "Cancelled"])
      .optional(),
    paymentStatus: z.enum(["unpaid", "pending", "paid", "failed"]).optional(),
  })
  .refine((v) => v.status || v.paymentStatus, {
    message: "status or paymentStatus required",
  });

ordersRouter.patch(
  "/orders/:orderId/state",
  requireAuthApi(),
  ensureDbUser(),
  async (req, res, next) => {
    try {
      const parsed = UpdateOrderStateSchema.parse(req.body);
      const update = {};
      const now = new Date();

      if (parsed.status) {
        update.status = parsed.status;
        update.statusUpdatedAt = now;
      }
      if (parsed.paymentStatus) {
        update.paymentStatus = parsed.paymentStatus;
        update.paymentStatusUpdatedAt = now;
        update.paidAt = parsed.paymentStatus === "paid" ? now : undefined;
      }

      const updated = await Order.findByIdAndUpdate(
        req.params.orderId,
        { $set: update },
        { new: true },
      ).lean();

      if (!updated) return res.status(404).json({ error: { message: "Not found" } });

      if (parsed.paymentStatus) {
        await Table.updateOne(
          { code: updated.tableCode },
          {
            $set: {
              status: parsed.paymentStatus === "paid" ? "billed" : "seated",
            },
          },
        );
      }

      res.json({
        order: {
          orderId: String(updated._id),
          status: updated.status,
          paymentStatus: updated.paymentStatus,
          statusUpdatedAt: updated.statusUpdatedAt ?? updated.updatedAt,
          paymentStatusUpdatedAt:
            updated.paymentStatusUpdatedAt ?? updated.updatedAt,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

