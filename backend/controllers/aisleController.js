const Aisle = require("../models/aisle.model");

// Create a new aisle
exports.createAisle = async (req, res) => {
    try {
        const newAisle = new Aisle(req.body);
        const savedAisle = await newAisle.save();
        res.status(201).json(savedAisle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all aisles
exports.getAisles = async (req, res) => {
    try {
        const aisles = await Aisle.find().populate("items");
        res.status(200).json(aisles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single aisle by ID
exports.getAisleById = async (req, res) => {
    try {
        const aisle = await Aisle.findById(req.params.id).populate("items");
        if (!aisle) {
            return res.status(404).json({ error: "Aisle not found" });
        }
        res.status(200).json(aisle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an aisle by ID
exports.updateAisle = async (req, res) => {
    try {
        const updatedAisle = await Aisle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedAisle) {
            return res.status(404).json({ error: "Aisle not found" });
        }
        res.status(200).json(updatedAisle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an aisle by ID
exports.deleteAisle = async (req, res) => {
    try {
        const deletedAisle = await Aisle.findByIdAndDelete(req.params.id);
        if (!deletedAisle) {
            return res.status(404).json({ error: "Aisle not found" });
        }
        res.status(200).json({ message: "Aisle deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};