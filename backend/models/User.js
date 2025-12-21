import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  customId: { type: String, required: true, unique: true},
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }, // 1-N: 1 Role có nhiều Users
  phone: { type: String },
  state: { type: String, enum: ["working", "off_work"], default: "working" },
  avatar: {type: String, default: ""},
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', userSchema);