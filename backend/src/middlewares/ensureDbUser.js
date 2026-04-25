import { clerkClient } from "@clerk/express";
import { User } from "../models/User.js";

function getClerkUserId(req) {
  const userId =
    req?.auth && typeof req.auth.userId === "string" ? req.auth.userId : null;
  if (!userId) throw new Error("Missing auth userId");
  return userId;
}

export function ensureDbUser() {
  return async (req, _res, next) => {
    try {
      const clerkUserId = getClerkUserId(req);

      const existing = await User.findOne({ clerkUserId }).lean();
      if (existing) {
        req.dbUser = existing;
        return next();
      }

      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const email =
        clerkUser.emailAddresses?.find(
          (e) => e.id === clerkUser.primaryEmailAddressId,
        )?.emailAddress ?? clerkUser.emailAddresses?.[0]?.emailAddress;

      const doc = await User.findOneAndUpdate(
        { clerkUserId },
        {
          $setOnInsert: { clerkUserId, role: "clerk" },
          $set: {
            email,
            firstName: clerkUser.firstName ?? undefined,
            lastName: clerkUser.lastName ?? undefined,
          },
        },
        { upsert: true, new: true },
      ).lean();

      req.dbUser = doc;
      next();
    } catch (err) {
      next(err);
    }
  };
}

