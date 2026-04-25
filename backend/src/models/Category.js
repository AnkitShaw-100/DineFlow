import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    name: { type: String, required: true, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

CategorySchema.index(
  { restaurantId: 1, name: 1 },
  { unique: true, sparse: true },
);

export const Category =
  mongoose.models.Category ?? mongoose.model("Category", CategorySchema);

