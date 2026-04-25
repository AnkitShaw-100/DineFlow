import { Router } from "express";
import { z } from "zod";
import { requireAuthApi } from "../../middlewares/requireAuthApi.js";
import { ensureDbUser } from "../../middlewares/ensureDbUser.js";
import { MenuItem } from "../../models/MenuItem.js";

export const menuItemsRouter = Router();

menuItemsRouter.get(
  "/menu-items",
  requireAuthApi(),
  ensureDbUser(),
  async (req, res, next) => {
    try {
      const q = z.string().trim().optional().safeParse(req.query.q);
      const active = z
        .enum(["true", "false"])
        .optional()
        .safeParse(req.query.active);

      const filter = {};
      if (q.success && q.data) filter.name = { $regex: q.data, $options: "i" };
      if (active.success && active.data)
        filter.isActive = active.data === "true";

      const items = await MenuItem.find(filter).sort({ name: 1 }).limit(500).lean();
      res.json({ items });
    } catch (err) {
      next(err);
    }
  },
);

const CreateMenuItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1).optional(),
  price: z.number().nonnegative(),
  isActive: z.boolean().optional(),
});

menuItemsRouter.post(
  "/menu-items",
  requireAuthApi(),
  ensureDbUser(),
  async (req, res, next) => {
    try {
      const parsed = CreateMenuItemSchema.parse(req.body);
      const created = await MenuItem.create({
        name: parsed.name,
        category: parsed.category,
        price: parsed.price,
        isActive: parsed.isActive ?? true,
      });
      res.status(201).json({ item: created });
    } catch (err) {
      next(err);
    }
  },
);

const UpdateMenuItemSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

menuItemsRouter.patch(
  "/menu-items/:id",
  requireAuthApi(),
  ensureDbUser(),
  async (req, res, next) => {
    try {
      const parsed = UpdateMenuItemSchema.parse(req.body);
      const updated = await MenuItem.findByIdAndUpdate(
        req.params.id,
        { $set: parsed },
        { new: true },
      ).lean();

      if (!updated) return res.status(404).json({ error: { message: "Not found" } });
      res.json({ item: updated });
    } catch (err) {
      next(err);
    }
  },
);

