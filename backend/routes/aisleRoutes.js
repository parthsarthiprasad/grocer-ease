const express = require("express");
const router = express.Router();
const aisleController = require("../controllers/aisleController");

// Define routes for CRUD operations
router.post("/aisles", aisleController.createAisle);
router.get("/aisles", aisleController.getAisles);
router.get("/aisles/:id", aisleController.getAisleById);
router.put("/aisles/:id", aisleController.updateAisle);
router.delete("/aisles/:id", aisleController.deleteAisle);

module.exports = router;