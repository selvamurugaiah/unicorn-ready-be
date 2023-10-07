import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Subscriptions = mongoose.model(
  "taskManagerSubscription",
  subscriptionSchema
);
