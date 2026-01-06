const multer = require("multer");
const fs = require("fs");
const { pool, sql } = require("../../database/dbConfig.js");

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/* ----------------------------------
   GET RO LIST
-----------------------------------*/
const getROList = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = await pool.request()
      .input("user_id", sql.VarChar(5), "00020")
      .input("fin_year", sql.VarChar(9), "2024-2025")
      .input("np_cd", sql.VarChar(6), "000019")
      .input("action", sql.VarChar(10), "get")
      .output("returnval", sql.Int)
      .execute("NP_ROList");

    if (result.output.returnval === -1) {
      return res.status(400).json({
        success: false,
        message: "Invalid input parameters",
      });
    }

    const data = result.recordset || [];

    res.status(200).json({
      success: true,
      total: data.length,
      page,
      limit,
      data: data.slice(startIndex, endIndex),
    });

  } catch (err) {
    console.error("GET RO LIST ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ----------------------------------
   REJECT RO
-----------------------------------*/
const rejectRO = async (req, res) => {
  try {
    const {
      advt_no,
      avak_ref_id,
      financial_year,
      remark,
      np_news_cd,
      reject_by_user_id,
      ip_address
    } = req.body;

    if (!advt_no || !avak_ref_id || !financial_year || !np_news_cd || !reject_by_user_id) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const result = await pool.request()
      .input("advt_no", sql.VarChar(50), advt_no)
      .input("avak_ref_id", sql.VarChar(50), avak_ref_id)
      .input("financial_year", sql.VarChar(9), financial_year)
      .input("remark", sql.NVarChar(300), remark || "")
      .input("reject_status_cd", sql.VarChar(2), "18")
      .input("status_reason_cd", sql.VarChar(2), "02")
      .input("np_news_cd", sql.Int, np_news_cd)
      .input("reject_by_user_id", sql.VarChar(5), reject_by_user_id)
      .input("ip_address", sql.VarChar(20), ip_address || "")
      .output("returnval", sql.Int)
      .execute("A_RejectRO");

    res.status(result.output.returnval === 1 ? 200 : 500).json({
      success: result.output.returnval === 1,
      message: result.output.returnval === 1
        ? "RO rejected successfully"
        : "RO rejection failed",
    });

  } catch (error) {
    console.error("Reject RO Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ----------------------------------
   UPLOAD PUBLISH PROOF
-----------------------------------*/
const uploadPublishProof = [
  upload.single("file"),
  async (req, res) => {
    try {
      const { advt_no, fin_year, ro_no, ip_address } = req.body;
      const file = req.file;

      if (!file || !advt_no || !fin_year || !ro_no) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const filePath = `/uploads/publish_proof/${file.filename}`;
      const fileUrl = `${req.protocol}://${req.get("host")}${filePath}`;

      const result = await pool.request()
        .input("advt_no", sql.VarChar(10), advt_no)
        .input("fin_year", sql.VarChar(6), fin_year)
        .input("ro_no", sql.Int, ro_no)
        .input("content_type", sql.NVarChar(100), file.mimetype)
        .input("file_size_in_bytes", sql.Numeric(18, 0), file.size)
        .input("link_name", sql.NVarChar(250), file.originalname)
        .input("advt_file_path", sql.NVarChar(250), filePath)
        .input("file_url", sql.NVarChar(500), fileUrl)
        .input("enable_status", sql.NVarChar(1), "Y")
        .input("ip_address", sql.VarChar(20), ip_address || "")
        .input("action", sql.VarChar(50), "upload_publish_proof")
        .output("returnval", sql.Int)
        .execute("NP_RO_Actions");

      res.json({
        success: result.output.returnval === 1,
        message: result.output.returnval === 1
          ? "Proof uploaded successfully"
          : "Upload failed",
        file_url: fileUrl,
      });

    } catch (error) {
      console.error("Upload Proof Error:", error);

      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({ success: false, message: error.message });
    }
  },
];

/* ----------------------------------
   EXPORTS
-----------------------------------*/
module.exports = {
  getROList,
  rejectRO,
  uploadPublishProof,
};
