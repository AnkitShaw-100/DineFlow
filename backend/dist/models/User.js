import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
    clerkUserId: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    role: {
        type: String,
        enum: ["owner", "manager", "server", "chef", "clerk"],
        default: "clerk",
        required: true,
        index: true,
    },
}, { timestamps: true });
export const User = mongoose.models.User ?? mongoose.model("User", UserSchema);
