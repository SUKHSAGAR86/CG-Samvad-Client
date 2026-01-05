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
router.get("/files/:ref_id/:financial_year/:categary",
  (req, res, next) => { res.set("Cache-Control", "no-store");  next(); },
  getFiles
);

// upload new file
router.post("/post-files",upload.single("file"), uploadFile);

// update existing file
router.put("/files",upload.single("file"),updateFile);

// delete file
router.delete("/files/delete/:ref_id/:financial_year/:sno",deleteFile);

// get by ref + category
router.get("/get-files/:ref_id/:categary_cd",getFilesRef_Catcd);

module.exports = router;


 