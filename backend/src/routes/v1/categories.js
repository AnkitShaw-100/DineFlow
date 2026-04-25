import { Router } from "express";
import { z } from "zod";
import { requireAuthApi } from "../../middlewares/requireAuthApi.js";
import { ensureDbUser } from "../../middlewares/ensureDbUser.js";
import { Category } from "../../models/Category.js";

export const categoriesRouter = Router();

categoriesRouter.get(
  "/categories",
  requireAuthApi(),
  ensureDbUser(),
  async (req, res, next) => {
    try {
      const active = z
        .enum(["true", "false"])
        .optional()
        .safeParse(req.query.active);

      const filter = {};
      if (active.success && active.data)
        filter.isActive = active.data === "true";

      const categories = await Category.find(filter)
        .sort({ name: 1 })
        .limit(200)
        .lean();

      res.json({ categories });
    } catch (err) {
      next(err);
    }
  },
);

const CreateCategorySchema = z.object({
  name: z.string().min(1),
});

categoriesRouter.post(
  "/categories",
  requireAuthApi(),
  ensureDbUser(),
  async (req, res, next) => {
    try {
      const parsed = CreateCategorySchema.parse(req.body);
      const created = await Category.create({
        name: parsed.name.trim(),
        isActive: true,
      });
      res.status(201).json({ category: created });
    } catch (err) {
      next(err);
    }
  },
);

