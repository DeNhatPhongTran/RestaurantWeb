import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  category: { type: String, enum: ["Món khai vị", "Món chính", "Món súp", "Món tráng miệng", "Đồ uống"], required: true},
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  status: { type: String, enum: ["Đang phục vụ","Dừng phục vụ"], default: "Đang phục vụ" },
  description: { type: String }
});

export default mongoose.model("MenuItem", menuItemSchema);