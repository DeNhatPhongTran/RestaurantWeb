import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation", required: true, unique: true }, // 1-1: 1 Reservation có 1 Invoice
  total_price: { type: Number, required: true },
  payment_method: { type: String, enum: ["cash","card","bank","ewallet"], required: true },
  paid_at: { type: Date, default: Date.now },
  cashier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // 1-N: 1 Cashier thanh toán nhiều Invoices
});

export default mongoose.model("Invoice", invoiceSchema);
