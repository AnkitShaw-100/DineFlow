import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    createdByClerkUserId: { type: String, index: true },
    orderNo: { type: Number, required: true, index: true },
    tableCode: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["New", "In kitchen", "Served", "Paid", "Cancelled"],
      default: "New",
      index: true,
    },
    serverName: { type: String },
    items: { type: [OrderItemSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed"],
      default: "unpaid",
      index: true,
    },
    paymentProvider: { type: String, enum: ["stripe"], index: true },
    stripeCheckoutSessionId: { type: String, index: true },
    paidAt: { type: Date },
    statusUpdatedAt: { type: Date, default: Date.now },
    paymentStatusUpdatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

OrderSchema.index(
  { restaurantId: 1, orderNo: 1 },
  { unique: true, sparse: true },
);

export const Order =
  mongoose.models.Order ?? mongoose.model("Order", OrderSchema);

