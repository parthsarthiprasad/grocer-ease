const express = require("express");
const mongoose = require("mongoose");
const findClosestShops = require("./controllers/searchService.js");
const itemRoutes = require("./routes/itemRoutes");
const aisleRoutes = require("./routes/aisleRoutes");
const shopRoutes = require("./routes/shopRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/grocery_inventory", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Use item, aisle, shop, and user routes
app.use("/api", itemRoutes);
app.use("/api", aisleRoutes);
app.use("/api", shopRoutes);
app.use("/api", userRoutes);

// Search API Endpoint
app.post("/search", async (req, res) => {
    const { latitude, longitude, items } = req.body;

    if (!latitude || !longitude || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Invalid input. Provide coordinates and a list of items." });
    }

    try {
        const shops = await findClosestShops(latitude, longitude, items);
        res.json({ message: "Shops found!", shops });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));
