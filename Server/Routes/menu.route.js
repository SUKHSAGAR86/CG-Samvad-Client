const express = require("express");
const router = express.Router();

const menuController = require("../Controllers/menuController");

// Full hierarchy
router.get("/menu", menuController.getUserMenu);

// Only menus
router.get("/menus", menuController.getMenusOnly);

// Submenus
router.get("/submenus", menuController.getSubMenus);

module.exports = router;