

// const express = require("express");
// const router = express.Router();
// const upload = require("../middlewares/upload");



// const { getFiles, uploadFile, updateFile, deleteFile,getUploadCategories,getFilesRef_Catcd } = require("../Controllers/uploadFile.controller");

// const multer = require("multer");

// const upload = multer(); // memory storage for file buffer


// router.get("/upload-categories", getUploadCategories);
// // router.get("/files/:ref_id/:financial_year", getFiles);
// router.get("/files/:ref_id/:financial_year/:categary", (req, res, next) => {
//   res.set("Cache-Control", "no-store");
//   next();
// }, getFiles);
// router.post("/post-files",upload.single("file"), uploadFile);
// router.put("/files",upload.single("file"), updateFile)
// router.delete("/files/delete/:ref_id/:financial_year/:sno", deleteFile)
// router.get(
//   "/get-files/:ref_id/:categary_cd",
//   getFilesRef_Catcd
// )
//  module.exports = router;



const express = require("express");
const router = express.Router();

const upload = require("../Middleware/uploadFileMulter.js"); // ✅ ONLY THIS

const {
  getFiles,
  uploadFile,
  updateFile,
  deleteFile,
  getUploadCategories,
  getFilesRef_Catcd
} = require("../Controllers/uploadFile.controller");

// ================= ROUTES =================

router.get("/upload-categories", getUploadCategories);

// disable cache
router.get(
  "/files/:ref_id/:financial_year/:categary",
  (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  },
  getFiles
);

// upload new file
router.post("/post-files",upload.single("file"), uploadFile);

// update existing file
router.put("/files",upload.single("file"),updateFile
);

// delete file
router.delete("/files/delete/:ref_id/:financial_year/:sno",deleteFile);

// get by ref + category
router.get("/get-files/:ref_id/:categary_cd",getFilesRef_Catcd);

module.exports = router;


 