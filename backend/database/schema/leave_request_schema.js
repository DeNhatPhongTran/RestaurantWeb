import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 1-N: 1 User có nhiều LeaveRequests
  leave_type: { type: String, enum: ["nghi_thuong","nghi_phep","nghi_che_do","nghi_le"], required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  total_days: { type: Number, required: true },
  reason: { type: String },
  status: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // 1-N: 1 Manager duyệt nhiều LeaveRequests
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("LeaveRequest", leaveRequestSchema);
