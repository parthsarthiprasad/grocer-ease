const mongoose = require("mongoose");
const geolib = require("geolib");
const Shop = require("../models/shop.model");

async function findClosestShops(startLat, startLon, itemNames) {
    // Get all shops that have at least one of the required items
    const shops = await Shop.find().populate({
        path: "aisles",
        populate: { path: "items" }
    });

    const validShops = [];

    for (const shop of shops) {
        // Collect all items available in this shop
        const shopItems = new Set();
        for (const aisle of shop.aisles) {
            for (const item of aisle.items) {
                shopItems.add(item.name.toLowerCase());
            }
        }

        // Check if the shop can provide at least one requested item
        const missingItems = itemNames.filter(item => !shopItems.has(item.toLowerCase()));
        if (missingItems.length < itemNames.length) {
            validShops.push({
                shop,
                distance: geolib.getDistance(
                    { latitude: startLat, longitude: startLon },
                    { latitude: shop.location.latitude, longitude: shop.location.longitude }
                ),
                missingItems
            });
        }
    }

    // Sort shops by proximity
    validShops.sort((a, b) => a.distance - b.distance);

    // Select the minimum number of shops to cover all requested items
    const selectedShops = [];
    const foundItems = new Set();

    for (const entry of validShops) {
        selectedShops.push(entry.shop);
        for (const aisle of entry.shop.aisles) {
            for (const item of aisle.items) {
                foundItems.add(item.name.toLowerCase());
            }
        }

        if (itemNames.every(item => foundItems.has(item.toLowerCase()))) {
            break; // Stop when all items are covered
        }
    }

    return selectedShops;
}

module.exports = findClosestShops;
