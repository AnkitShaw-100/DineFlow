import mongoose, { Schema } from "mongoose";

const MenuItemSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    name: { type: String, required: true, index: true },
    category: { type: String, index: true },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

MenuItemSchema.index(
  { restaurantId: 1, name: 1 },
  { unique: true, sparse: true },
);

export const MenuItem =
  mongoose.models.MenuItem ?? mongoose.model("MenuItem", MenuItemSchema);

