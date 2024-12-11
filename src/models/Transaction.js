const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  teacherShare: { type: Number, required: true },
  status: { type: String, enum: ["success", "failed"], default: "success" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);