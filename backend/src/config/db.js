import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export async function connectDb(env) {
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production",
  });
}

