const express = require("express");
const router = express.Router();

const itemController = require("../Controllers/itemController");


// Routes
router.get("/", itemController.getItems);
router.post("/", itemController.createItem);
router.get("/:id", itemController.getItemById);
router.put("/:id", itemController.updateItemById);
router.delete("/:id", itemController.deleteItemById);

module.exports = router;