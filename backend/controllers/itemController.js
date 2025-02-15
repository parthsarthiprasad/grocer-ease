const Item = require("../models/item.model");

// Create a new item
exports.createItem = async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all items
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single item by ID
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an item by ID
exports.updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an item by ID
exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};