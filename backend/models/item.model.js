const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Define inventory types
const INVENTORY_TYPES = ["Perishable", "Non-Perishable", "Beverage", "Household", "Bulk", "Seasonal"];

// Define Schema
const itemSchema = new mongoose.Schema({
    uuid: { type: String, default: uuidv4, unique: true }, // Auto-generate UUID
    name: { type: String, required: true },
    inventoryType: { type: String, enum: INVENTORY_TYPES, required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Create Model
const item = mongoose.model("item", itemSchema);

module.exports = item;
