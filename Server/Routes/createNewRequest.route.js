const express=require("express");
const { getCreateNewRequiest } = require("../Controllers/createNewRequest.controller");

const router=express.Router();
router.get("/createnewrequest",getCreateNewRequiest);

module.exports=router;