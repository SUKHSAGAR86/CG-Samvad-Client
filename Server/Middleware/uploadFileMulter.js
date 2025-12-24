// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|pdf|doc/;
//   const extName = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const mimeType = allowedTypes.test(file.mimetype);

//   if (extName && mimeType) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPG, PNG, PDF and Doc files allowed"));
//   }
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
//   fileFilter,
// });

// module.exports = upload;

// =================================

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    try {
      /*
        Frontend MUST send:
        - ref_id
        - categary_cd (LETTER / MATTER)
        - nextCount
      */

      const { ref_id, categary_cd, nextCount } = req.body;

      if (!ref_id || !categary_cd || !nextCount) {
        return cb(new Error("Missing filename parameters"));
      }

      const ext = path.extname(file.originalname);

      const finalFileName = `${ref_id}_${categary_cd}_${nextCount}${ext}`;

      // make available for controller
      req.generatedFileName = finalFileName;

      cb(null, finalFileName);
    } catch (err) {
      cb(err);
    }
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, PDF and DOC files allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter,
});

module.exports = upload;
