import express from "express";
import MenuItem from "../database/schema/menu_item_schema.js";
import Category from "../database/schema/category_schema.js";
import { verifyToken } from "./auth.js";

const router = express.Router();

// ============================================================================
// ROUTES STRUCTURE:
// GET  /api/menu/categories         - Get all categories
// GET  /api/menu/items              - Get all menu items
// GET  /api/menu/items/:id          - Get single menu item by ID
// GET  /api/menu/items/by-category/:categoryId - Get items by category
// POST /api/menu/items              - Create new menu item
// PUT  /api/menu/items/:id          - Update menu item
// DELETE /api/menu/items/:id        - Delete menu item
// ============================================================================

// IMPORTANT: Specific routes MUST come BEFORE parameterized routes (:id)
// Order: /categories → /items/by-category/:categoryId → /items/:id

// GET /api/menu/random - Get 6 random menu items (SPECIAL ROUTE - FIRST)
router.get("/random", async (req, res) => {
  try {
    const items = await MenuItem.find()
      .populate("category", "category_name")
      .select("_id name price image description status category")
      .lean()
      .exec();
    
    // Shuffle and get first 6 items
    let randomItems = items.sort(() => 0.5 - Math.random()).slice(0, 6);
    
    res.json({
      success: true,
      message: "Random menu items fetched successfully",
      data: randomItems,
      count: randomItems.length
    });
  } catch (error) {
    console.error("Error fetching random menu items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch random menu items",
      error: error.message
    });
  }
});

// GET /api/menu/categories - Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find()
      .select("_id category_name");
    
    res.json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message
    });
  }
});

// GET /api/menu/items - Get all menu items with category details
router.get("/items", async (req, res) => {
  try {
    const items = await MenuItem.find()
      .populate("category", "category_name")
      .select("_id name price image description status category");
    
    res.json({
      success: true,
      message: "All menu items fetched successfully",
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu items",
      error: error.message
    });
  }
});

// GET /api/menu/items/:id - Get single menu item by ID (AFTER specific routes)
router.get("/items/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
      .populate("category", "category_name");
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
        error: "Item with this ID does not exist"
      });
    }
    
    res.json({
      success: true,
      message: "Menu item fetched successfully",
      data: item
    });
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu item",
      error: error.message
    });
  }
});

// POST /api/menu/items - Create new menu item (requires authentication)
router.post("/items", async (req, res) => {
  try {
    const { name, price, image, description, category, status } = req.body;
    
    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
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
    await newItem.populate("category", "category_name");
    
    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: newItem
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create menu item",
      error: error.message
    });
  }
});

// PUT /api/menu/items/:id - Update menu item (requires authentication)
router.put("/items/:id", async (req, res) => {
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
    ).populate("category", "category_name");
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
        error: "Item with this ID does not exist"
      });
    }
    
    res.json({
      success: true,
      message: "Menu item updated successfully",
      data: item
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update menu item",
      error: error.message
    });
  }
});

// DELETE /api/menu/items/:id - Delete menu item (requires authentication)
router.delete("/items/:id", async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
        error: "Item with this ID does not exist"
      });
    }
    
    res.json({
      success: true,
      message: "Menu item deleted successfully",
      data: item
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete menu item",
      error: error.message
    });
  }
});

// ============================================================================
// CATEGORY MANAGEMENT ROUTES
// ============================================================================

// POST /api/menu/categories - Create new category (requires token)
router.post("/categories", verifyToken, async (req, res) => {
  try {
    const { category_name } = req.body;
    
    // Validate required fields
    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: "category_name is required"
      });
    }
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }
    
    const newCategory = new Category({ category_name });
    await newCategory.save();
    
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message
    });
  }
});

// PUT /api/menu/categories/:id - Update category (requires token)
router.put("/categories/:id", verifyToken, async (req, res) => {
  try {
    const { category_name } = req.body;
    
    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: "category_name is required"
      });
    }
    
    // Check if new category_name already exists
    const existingCategory = await Category.findOne({ 
      category_name, 
      _id: { $ne: req.params.id } 
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists"
      });
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { category_name },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    
    res.json({
      success: true,
      message: "Category updated successfully",
      data: category
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message
    });
  }
});

// DELETE /api/menu/categories/:id - Delete category (requires token)
router.delete("/categories/:id", verifyToken, async (req, res) => {
  try {
    // Check if any menu items use this category
    const itemsWithCategory = await MenuItem.find({ category: req.params.id }).count();
    if (itemsWithCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${itemsWithCategory} menu item(s) assigned to this category.`
      });
    }
    
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    
    res.json({
      success: true,
      message: "Category deleted successfully",
      data: category
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message
    });
  }
});

export default router;
