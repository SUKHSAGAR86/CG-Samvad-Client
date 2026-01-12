


const { pool, sql, poolConnect } = require("../Database/dbConfig");
const getClientIp = require("../utils/getClientIp");

// ===================== GET UPLOAD CATEGORIES =====================
const getUploadCategories = async (req, res) => {
  try {
    await poolConnect;

    const { ref_id, financial_year } = req.query;

    const result = await pool
      .request()
      .input("ref_id", sql.VarChar(12), ref_id)
      .input("financial_year", sql.VarChar(9), financial_year)
      .execute("Client_GetUploadCategory");

    res.status(200).json({
      status: 1,
      data: result.recordset,
    });
  } catch (err) {
    console.error("getUploadCategories Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ===================== GET FILES =====================
const getFiles = async (req, res) => {
  try {
    await poolConnect;

    const { ref_id, financial_year, categary_cd } = req.params;

    const result = await pool
      .request()
      .input("ref_id", sql.VarChar(12), ref_id)
      .input("financial_year", sql.VarChar(9), financial_year)
      .input("categary_cd", sql.VarChar(2), categary_cd)
      .input("action", sql.VarChar(10), "get")
      .output("returnval", sql.Int)
      .execute("Client_FileUpload_CRUD");

    res.status(200).json({
      ref_id,
      financial_year,
      status: result.output.returnval,
      data: result.recordset,
    });
  } catch (err) {
    console.error("getFiles Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ===================== GET FILES BY REF & CATEGORY =====================
const getFilesRef_Catcd = async (req, res) => {
  try {
    await poolConnect;

    const { ref_id, categary_cd } = req.params;

    const result = await pool
      .request()
      .input("ref_id", sql.VarChar, ref_id)
      .input("categary_cd", sql.VarChar, categary_cd)
      .query(`
        SELECT ref_id, link_name, content_type, file_size_in_bytes
        FROM Client_Advt_Rquest_Upload_Letter
        WHERE ref_id = @ref_id
          AND categary_cd = @categary_cd
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===================== UPLOAD FILE =====================
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    const { ref_id, financial_year, categary_cd, user_id, user_name = "" } =
      req.body;

    if (!ref_id || !financial_year || !categary_cd || !user_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await poolConnect;
    const userIp = getClientIp(req);

    const fileName = req.generatedFileName;
console.log("filename",fileName)
    const result = await pool
      .request()
      .input("ref_id", sql.VarChar(12), ref_id)
      .input("financial_year", sql.VarChar(9), financial_year)
      .input("categary_cd", sql.VarChar(2), categary_cd)
      .input("sno", sql.Int, 0)
      .input("link_name", sql.NVarChar(250), fileName)
      .input("content_type", sql.NVarChar(100), req.file.mimetype)
      .input("file_size_in_bytes", sql.Numeric(18, 0), req.file.size)
      .input("user_id", sql.VarChar(5), user_id)
      .input("user_name", sql.NVarChar(100), user_name)
      .input("user_ip", sql.VarChar(20), userIp)
      .input("action", sql.VarChar(10), "post")
      .output("returnval", sql.Int)
      .execute("Client_FileUpload_CRUD");

    res.status(200).json({
      status: result.output.returnval,
      link_name: fileName,
      message: "Uploaded successfully",
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===================== UPDATE FILE =====================
const updateFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File required" });
    }

    const { ref_id, financial_year, sno, user_id, user_name = "" } = req.body;

    if (!ref_id || !financial_year || !sno || !user_id) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await poolConnect;
    const userIp = getClientIp(req);

    // ✅ NEW FILE NAME FROM MULTER
    const newFileName = req.generatedFileName;

    const result = await pool
      .request()
      .input("ref_id", sql.VarChar(12), ref_id)
      .input("financial_year", sql.VarChar(9), financial_year)
      .input("sno", sql.Int, parseInt(sno))
      .input("link_name", sql.NVarChar(250), newFileName)
      .input("content_type", sql.NVarChar(100), req.file.mimetype)
      .input("file_size_in_bytes", sql.Numeric(18, 0), req.file.size)
      .input("user_id", sql.VarChar(5), user_id)
      .input("user_name", sql.NVarChar(100), user_name)
      .input("user_ip", sql.VarChar(20), userIp)
      .input("action", sql.VarChar(10), "update")
      .output("returnval", sql.Int)
      .execute("Client_FileUpload_CRUD");

    res.status(200).json({
      status: result.output.returnval,
      link_name: newFileName,
      message: "Updated successfully",
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===================== DELETE FILE =====================
const deleteFile = async (req, res) => {
  try {
    const { ref_id, financial_year, sno } = req.params;
    const { user_id, user_name = "" } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "user_id required" });
    }

    await poolConnect;
    const userIp = getClientIp(req);

    const result = await pool
      .request()
      .input("ref_id", sql.VarChar(12), ref_id)
      .input("financial_year", sql.VarChar(9), financial_year)
      .input("sno", sql.Int, parseInt(sno))
      .input("user_id", sql.VarChar(5), user_id)
      .input("user_name", sql.NVarChar(100), user_name)
      .input("user_ip", sql.VarChar(20), userIp)
      .input("action", sql.VarChar(10), "delete")
      .output("returnval", sql.Int)
      .execute("Client_FileUpload_CRUD");

    res.status(200).json({
      status: result.output.returnval,
      message: "Deleted successfully",
    });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getUploadCategories,
  getFiles,
  getFilesRef_Catcd,
  uploadFile,
  updateFile,
  deleteFile,
};