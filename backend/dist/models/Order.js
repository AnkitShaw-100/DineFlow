import mongoose, { Schema } from "mongoose";
const OrderItemSchema = new Schema({
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
}, { _id: false });
const OrderSchema = new Schema({
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
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
}, { timestamps: true });
OrderSchema.index({ restaurantId: 1, orderNo: 1 }, { unique: true, sparse: true });
export const Order = mongoose.models.Order ?? mongoose.model("Order", OrderSchema);
