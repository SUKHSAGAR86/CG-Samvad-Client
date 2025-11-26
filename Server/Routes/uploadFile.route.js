

const express = require("express");
const router = express.Router();

const { getFiles, uploadFile, updateFile, deleteFile,getUploadCategories } = require("../Controllers/uploadFile.controller");

const multer = require("multer");

const upload = multer(); // memory storage for file buffer


router.get("/upload-categories", getUploadCategories);
// router.get("/files/:ref_id/:financial_year", getFiles);
router.get("/files/:ref_id/:financial_year/:categary", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
}, getFiles);
router.post("/post-files",upload.single("file"), uploadFile);
router.put("/files",upload.single("file"), updateFile)
router.delete("/files/delete/:ref_id/:financial_year/:sno", deleteFile)

 module.exports = router;



