const express = require("express");
const router = express.Router();

const { getClientNotices } = require("../Controllers/clientNotices.controller.js");

router.get("/get-clientnotices", getClientNotices);


module.exports = router;
