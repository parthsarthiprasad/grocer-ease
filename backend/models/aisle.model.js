const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Define Schema
const aisleSchema = new mongoose.Schema({
    uuid: { type: String, default: uuidv4, unique: true }, // Auto-generate UUID
    name: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "InventoryItem" }], // Reference to inventory items
    location: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

// Create Model
const Aisle = mongoose.model("Aisle", aisleSchema);

module.exports = Aisle;
