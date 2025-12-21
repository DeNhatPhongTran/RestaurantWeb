import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  //category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // 1-N: 1 Category có nhiều MenuItems
  category: { type: String, enum: ["Món khai vị", "Món chính", "Món súp", "Món tráng miệng", "Đồ uống"], required: true},
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  status: { type: String, enum: ["Đang phục vụ","Dừng phục vụ"], default: "Đang phục vụ" },
  description: { type: String }
  // 1-N: 1 MenuItem được lấy bởi nhiều OrderItems (OrderItems.item)
});

export default mongoose.model("MenuItem", menuItemSchema);
