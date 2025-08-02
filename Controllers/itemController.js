const Item = require("../Models/Item");
const mongoose = require('mongoose')
// READ - Get all items with optional filtering and pagination
const getItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, isActive, search } = req.query;

    // Build query object
    const query = {};

    if (category) {
      query.category = category;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination
    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Item.countDocuments(query);

    res.json({
      success: true,
      data: items,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: err.message,
    });
  }
};
// CREATE - Add new item
const createItem = async (req, res) => {
  try {
    const { name, description, category, isActive } = req.body;
    console.log(req.body);

    const newItem = new Item({
      name,
      description,
      category,
      isActive,
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: savedItem,
    });
  } catch (err) {
    console.error("Error creating item:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: err.message,
    });
  }
};
// READ - Get single item by ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format",
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch item",
      error: err.message,
    });
  }
};
// UPDATE - Update item by ID
const updateItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format",
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(id, updates, {
      new: true, // Return updated document
      runValidators: true, // Run schema validation
    });

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (err) {
    console.error("Error updating item:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update item",
      error: err.message,
    });
  }
};
// DELETE - Delete item by ID
const deleteItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format",
      });
    }

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      message: "Item deleted successfully",
      data: deletedItem,
    });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: err.message,
    });
  }
};
module.exports = {
  getItems,
  createItem,
  getItemById,
  updateItemById,
  deleteItemById,
};
