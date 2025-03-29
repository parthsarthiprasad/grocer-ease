const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const findClosestShops = require("./controllers/searchService.js");
const itemRoutes = require("./routes/itemRoutes");
const aisleRoutes = require("./routes/aisleRoutes");
const shopRoutes = require("./routes/shopRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const { auth, adminAuth, userAuth } = require("./middleware/auth");
const config = require("./config/config");

const app = express();

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true, // Required for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Chat routes - accessible by both admin and regular users
app.use("/api/chat", auth, chatRoutes);

// Protected admin routes
app.use("/api/users", adminAuth, userRoutes);
app.use("/api/shops", adminAuth, shopRoutes);
app.use("/api/aisles", adminAuth, aisleRoutes);
app.use("/api/items", adminAuth, itemRoutes);

// MongoDB Atlas connection with retry logic
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongodb.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: "majority",
        });
        console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB Atlas connection error:", error);
        console.log("Retrying connection in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
};

// Initial connection attempt
connectDB();

// Handle MongoDB connection errors
mongoose.connection.on("error", (err) => {
    console.error("MongoDB Atlas connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB Atlas disconnected. Attempting to reconnect...");
    connectDB();
});

// Search API Endpoint (protected)
app.post("/search", auth, async (req, res) => {
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
const PORT = config.server.port;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
