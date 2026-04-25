import { Router } from "express";
import { clerkClient } from "@clerk/express";
import { requireAuthApi } from "../../middlewares/requireAuthApi.js";
import { ensureDbUser } from "../../middlewares/ensureDbUser.js";
import { User } from "../../models/User.js";

export const meRouter = Router();

function getClerkUserId(req) {
  const userId =
    req?.auth && typeof req.auth.userId === "string" ? req.auth.userId : null;
  if (!userId) throw new Error("Missing auth userId");
  return userId;
}

meRouter.get("/me", requireAuthApi(), ensureDbUser(), async (req, res, next) => {
  try {
    const clerkUserId = getClerkUserId(req);
    const user = await User.findOne({ clerkUserId }).lean();
    res.json({ user: user ?? null });
  } catch (err) {
    next(err);
  }
});

// Sync the signed-in Clerk user into MongoDB
meRouter.post("/me/sync", requireAuthApi(), ensureDbUser(), async (req, res, next) => {
  try {
    const clerkUserId = getClerkUserId(req);
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    const email =
      clerkUser.emailAddresses?.find(
        (e) => e.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress ?? clerkUser.emailAddresses?.[0]?.emailAddress;

    const doc = await User.findOneAndUpdate(
      { clerkUserId },
      {
        $setOnInsert: { clerkUserId },
        $set: {
          email,
          firstName: clerkUser.firstName ?? undefined,
          lastName: clerkUser.lastName ?? undefined,
        },
      },
      { new: true, upsert: true },
    ).lean();

    res.json({ user: doc });
  } catch (err) {
    next(err);
  }
});

