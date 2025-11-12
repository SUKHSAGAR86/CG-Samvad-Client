const express=require("express")
const { insertClientAdvtRequest } = require("../Controllers/InsertClientAdvtRequest.controller")

const router=express.Router()
router.post("/insert/client-advt-request",insertClientAdvtRequest);

module.exports=router;