
const express = require("express");

const {
  insertClientAdvtRequest,
  getAllRequests,
  getRequestById,
  updateClientAdvtRequest,
  deleteClientAdvtRequest
} = require("../Controllers/InsertClientAdvtRequest.controller");

const router = express.Router();
router.post("/client-advt-request", insertClientAdvtRequest);
router.get("/get-client-advt-request", getAllRequests);
router.get("/get-client-advt-request/:ref_id", getRequestById);
router.put("/client-advt-request/:ref_id", updateClientAdvtRequest);
router.delete("/client-advt-request/:ref_id", deleteClientAdvtRequest);

module.exports = router;