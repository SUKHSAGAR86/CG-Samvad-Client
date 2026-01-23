const express = require("express");

const {
  getNewspapers,
  getNpUserWithNewspaper,
  npProfileHandler,
} = require("../Controllers/Newspaper/newspaper");

const { noticeBoard, fakeNoticeBoard } = require("../Controllers/Newspaper/noticeBoard");

const {
  getNpBankDetails,
  postOrEditNpBankDetails,
} = require("../controllers/Newspaper/npBankController");

const {
  getGstDetails,
  checkGstExists,
  updateGstDetails,
} = require("../Controllers/Newspaper/npGSTController");

const {
  getNpBankSubDetails,
} = require("../Controllers/Newspaper/npBankSubController");

const {
  getStates,
  getDistricts,
} = require("../Controllers/Newspaper/common");

const {
  getROList,
  rejectRO,
  uploadPublishProof,
  getActionStatus
} = require("../controllers/Newspaper/realeaseOrder");

const router = express.Router();

// common API
router.get("/states", getStates);
router.get("/district", getDistricts);

// newspaper user Detail API
router.get("/newspaper", getNewspapers);
router.get("/npuser/:user_id", getNpUserWithNewspaper);
router.post("/np-profile", npProfileHandler);

// GST User Detail API
router.get("/gst/:user_id", getGstDetails);
router.get("/gst-exists/:user_id", checkGstExists);
router.post("/gst/update", updateGstDetails);

// Bank Sub Detail API
router.get("/bank-sub-detail/:np_cd", getNpBankSubDetails);
router.post("/np/bank-detail", getNpBankSubDetails);

// Bank Detail API
router.get("/np/bank-detail/:np_cd", getNpBankDetails);
router.post("/np/bank-detail/edit", postOrEditNpBankDetails);

// Release Order API
router.get("/ro/list", getROList);
router.post("/ro/reject-ro", rejectRO);
router.get("/ro/actions/list", getActionStatus);
router.post("/ro/uploadProof", uploadPublishProof);

// Notice board API
router.get("/notice-board", noticeBoard);
router.get("/fakeNoticeBoard", fakeNoticeBoard)

module.exports = router;
