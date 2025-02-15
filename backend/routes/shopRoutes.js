const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

// Define routes for CRUD operations
router.post("/shops", shopController.createShop);
router.get("/shops", shopController.getShops);
router.get("/shops/:id", shopController.getShopById);
router.put("/shops/:id", shopController.updateShop);
router.delete("/shops/:id", shopController.deleteShop);

module.exports = router;