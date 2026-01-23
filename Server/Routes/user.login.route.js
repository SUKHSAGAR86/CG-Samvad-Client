const express = require("express");
const {
  getAllLoginType,
   getLoginTypeByid,getfinancialYear
} = require("../Controllers/login/userslogin.controller");

const router = express.Router();

router.get("/usertype", getAllLoginType);
router.get("/usertype/:code", getLoginTypeByid);
router.get("/financialyear", getfinancialYear);

module.exports = router;
