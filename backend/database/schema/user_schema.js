import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }, // 1-N: 1 Role có nhiều Users
  phone: { type: String },
  state: { type: String, enum: ["working", "off_work"], default: "working" },
  change_password: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
  // 1-N: 1 User có nhiều LeaveRequests (LeaveRequests.user)
  // 1-N: 1 User (manager) duyệt nhiều LeaveRequests (LeaveRequests.approved_by)
  // 1-N: 1 Cashier thanh toán nhiều Invoices (Invoices.cashier)
});

export default mongoose.model("User", userSchema);
