

const express = require("express");
const router = express.Router();

const { getFiles, uploadFile, updateFile, deleteFile } = require("../Controllers/uploadFile.controller");

const multer = require("multer");

const upload = multer(); // memory storage for file buffer



// router.get("/get-file",getFiles);;
// router.post("/files",upload.single("file"),uploadFile);
// router.put("/files",upload.single("file"),updateFile)
// router.delete("file",deleteFile)


router.get("/files/:ref_id/:financial_year", getFiles);
router.post("/post-files", upload.single("file"), uploadFile);
router.put("/files", upload.single("file"), updateFile);
router.delete("/files/:ref_id/:financial_year/:sno", deleteFile);

 module.exports = router;



