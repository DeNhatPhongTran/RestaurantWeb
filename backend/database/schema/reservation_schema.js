import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  customer_phone: { type: String },
  guest_expected: { type: Number, default: 0 },
  guest_attended: { type: Number, default: 0 },
  datetime_checkin: { type: Date, required: true },
  status: { type: String, enum: ["pending","confirmed","cancelled","finished"], default: "pending" },
  created_at: { type: Date, default: Date.now }
  // 1-N: 1 Reservation có nhiều Tables (Tables.reservation)
  // 1-N: 1 Reservation có nhiều OrderItems (OrderItems.reservation)
  // 1-1: 1 Reservation có 1 Invoice (Invoices.reservation, unique)
});

export default mongoose.model("Reservation", reservationSchema);
