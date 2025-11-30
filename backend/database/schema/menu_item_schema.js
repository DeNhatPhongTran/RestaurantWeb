import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // 1-N: 1 Category có nhiều MenuItems
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ["available","sold_out"], default: "available" },
  description: { type: String }
  // 1-N: 1 MenuItem được lấy bởi nhiều OrderItems (OrderItems.item)
});

export default mongoose.model("MenuItem", menuItemSchema);
