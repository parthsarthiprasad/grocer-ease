const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Define Shop Schema
const shopSchema = new mongoose.Schema({
    uuid: { type: String, default: uuidv4, unique: true }, // Auto-generate UUID
    name: { type: String, required: true },
    aisles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Aisle" }], // Reference to Aisle model
    location: {
        latitude: { type: Number, required: true }, // GPS coordinates
        longitude: { type: Number, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

// Create Model
const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
