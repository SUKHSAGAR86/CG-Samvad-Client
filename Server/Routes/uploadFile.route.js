

const express = require("express");
const router = express.Router();

const { getFiles, uploadFile, updateFile, deleteFile } = require("../Controllers/uploadFile.controller");

const multer = require("multer");

const upload = multer(); // memory storage for file buffer



router.get("/files/:ref_id/:financial_year",getFiles);;
router.post("/post-files",upload.single("file"),uploadFile);
router.put("/files",upload.single("file"),updateFile)
router.delete("/files/delete/:ref_id/:financial_year/:sno",deleteFile)


// router.get("/files/:ref_id/:financial_year", getFiles);

// // UPLOAD FILE
// router.post("/files/upload", upload.single("file"), uploadFile);

// // UPDATE FILE
// router.put("/files/update", upload.single("file"), updateFile);

// // DELETE FILE
// router.delete("/files/delete/:ref_id/:financial_year/:sno", deleteFile);


 module.exports = router;



