const express = require("express");
const {
  insertClientAdvtRequest,
} = require("../Controllers/InsertClientAdvtRequest.controller");

const router = express.Router();

router.post("/client-advt-request", insertClientAdvtRequest);

module.exports = router;

