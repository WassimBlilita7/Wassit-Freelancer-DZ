import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "succeeded", "failed"],
    default: "pending",
  },
  provider: {
    type: String,
    enum: ["stripe", "paypal", "mock"],
    default: "mock",
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
    default: function () {
      return `mock_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment; 