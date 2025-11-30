import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category_name: { type: String, required: true, unique: true }
  // 1-N: 1 Category có nhiều MenuItems (MenuItems.category)
});

export default mongoose.model("Category", categorySchema);
