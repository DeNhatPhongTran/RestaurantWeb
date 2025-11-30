import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role_name: { type: String, required: true, unique: true }
  // 1-N: 1 Role có nhiều Users (Users.role)
});

export default mongoose.model("Role", roleSchema);
