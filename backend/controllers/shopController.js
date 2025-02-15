const Shop = require("../models/shop.model");

// Create a new shop
exports.createShop = async (req, res) => {
    try {
        const newShop = new Shop(req.body);
        const savedShop = await newShop.save();
        res.status(201).json(savedShop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all shops
exports.getShops = async (req, res) => {
    try {
        const shops = await Shop.find().populate("aisles");
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single shop by ID
exports.getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate("aisles");
        if (!shop) {
            return res.status(404).json({ error: "Shop not found" });
        }
        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a shop by ID
exports.updateShop = async (req, res) => {
    try {
        const updatedShop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedShop) {
            return res.status(404).json({ error: "Shop not found" });
        }
        res.status(200).json(updatedShop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a shop by ID
exports.deleteShop = async (req, res) => {
    try {
        const deletedShop = await Shop.findByIdAndDelete(req.params.id);
        if (!deletedShop) {
            return res.status(404).json({ error: "Shop not found" });
        }
        res.status(200).json({ message: "Shop deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};