import express from "express";
import MenuItem from "../database/schema/menu_item_schema.js";
import Category from "../database/schema/category_schema.js";

const router = express.Router();

// GET all menu items with category details
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find()
      .populate("category", "name") // Populate category name
      .select("_id name price image description status category");
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch menu items"
    });
  }
});

// GET menu items by category
router.get("/category/:categoryId", async (req, res) => {
  try {
    const items = await MenuItem.find({ category: req.params.categoryId })
      .populate("category", "name")
      .select("_id name price image description status category");
    
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch menu items by category"
    });
  }
});

// GET single menu item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
      .populate("category", "name");
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found"
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch menu item"
    });
  }
});

// POST create new menu item (admin only - optional role check)
router.post("/", async (req, res) => {
  try {
    const { name, price, image, description, category, status } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        error: "Name, price, and category are required"
      });
    }
    
    const newItem = new MenuItem({
      name,
      price,
      image: image || "",
      description: description || "",
      category,
      status: status || "available"
    });
    
    await newItem.save();
    await newItem.populate("category", "name");
    
    res.status(201).json({
      success: true,
      data: newItem,
      message: "Menu item created successfully"
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create menu item"
    });
  }
});

// PUT update menu item
router.put("/:id", async (req, res) => {
  try {
    const { name, price, image, description, category, status } = req.body;
    
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        image,
        description,
        category,
        status
      },
      { new: true, runValidators: true }
    ).populate("category", "name");
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found"
      });
    }
    
    res.json({
      success: true,
      data: item,
      message: "Menu item updated successfully"
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update menu item"
    });
  }
});

// DELETE menu item
router.delete("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found"
      });
    }
    
    res.json({
      success: true,
      data: item,
      message: "Menu item deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete menu item"
    });
  }
});

// GET all categories (helper for frontend)
router.get("/categories/all/list", async (req, res) => {
  try {
    const categories = await Category.find()
      .select("_id name");
    
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch categories"
    });
  }
});

export default router;
