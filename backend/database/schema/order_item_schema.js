import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation", required: true }, // 1-N: 1 Reservation có nhiều OrderItems
  item: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true }, // 1-1: 1 OrderItem lấy 1 MenuItem
  quantity: { type: Number, required: true },
  note: { type: String },
  status: { type: String, enum: ["waiting","cooking","cooked"], default: "waiting" },
  serving_status: { type: String, enum: ["served", "unserved"], default: "unserved" }, // Trạng thái phục vụ
  price_at_time: { type: Number, required: true },
  ordered_at: { type: Date, default: Date.now } // Thời gian đặt món
});

export default mongoose.model("OrderItem", orderItemSchema);
