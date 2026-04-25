import mongoose, { Schema } from "mongoose";

const ChecklistItemSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    done: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

ChecklistItemSchema.index({ clerkUserId: 1, createdAt: -1 });

export const ChecklistItem =
  mongoose.models.ChecklistItem ??
  mongoose.model("ChecklistItem", ChecklistItemSchema);

