// const { pool, sql, poolConnect } = require("../Database/dbConfig");
// const getClientIp = require("../utils/getClientIp");

// // ===================== GET UPLOAD CATEGORIES =====================
// const getUploadCategories = async (req, res) => {
//   try {
//     await poolConnect;

//     const { ref_id, financial_year } = req.query;

//     const request = pool.request();
//     request.input("ref_id", sql.VarChar(12), ref_id);
//     request.input("financial_year", sql.VarChar(9), financial_year);

//     const result = await request.execute("Client_GetUploadCategory");

//     return res.status(200).json({
//       status: 1,
//       data: result.recordset, // contains cat_cd and cat_name
//     });
//   } catch (err) {
//     console.error("getUploadCategories Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // ===================== GET FILES =====================
// const getFiles = async (req, res) => {
//   try {
//     await poolConnect;

//     const { ref_id, financial_year, categary_cd } = req.params; // FIXED

//     const request = pool.request();
//     request.input("ref_id", sql.VarChar(12), ref_id);
//     request.input("financial_year", sql.VarChar(9), financial_year);
//     request.input("categary_cd", sql.VarChar(2), categary_cd);

//     request.input("action", sql.VarChar(10), "get");
//     request.output("returnval", sql.Int);

//     const result = await request.execute("Client_FileUpload_CRUD");

//     return res.status(200).json({
//       ref_id: req.params.ref_id,
//       financial_year: req.params.financial_year,
//       status: result.output.returnval,
//       data: result.recordset,
//     });
//   } catch (err) {
//     console.error("getFiles Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // ==========================Get uploaded file ref_id and categary_cd===========================

// const getFilesRef_Catcd = async (req, res) => {
//   try {
//     await poolConnect;

//     const { ref_id, categary_cd } = req.params;

//     const result = await pool
//       .request()
//       .input("ref_id", sql.VarChar, ref_id)
//       .input("categary_cd", sql.VarChar, categary_cd)
//       .query(`
//         SELECT ref_id, link_name, content_type, file_size_in_bytes
//         FROM Client_Advt_Rquest_Upload_Letter
//         WHERE ref_id = @ref_id
//           AND categary_cd = @categary_cd
//       `);

//     res.status(200).json(result.recordset);

//   } catch (error) {
//     console.error("Error fetching files:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };



// const uploadFile = async (req, res) => {
//   try {
//     // console.log("======== FILE UPLOAD DEBUG START ========");

//     await poolConnect;

//     // LOG BODY & FILE
//     // console.log("👉 req.body:", req.body);
//     // console.log("👉 req.file:", req.file ? {
//     //   originalname: req.file.originalname,
//     //   mimetype: req.file.mimetype,
//     //   size: req.file.size
//     // } : "NO FILE RECEIVED");

//     const file = req.file;
//     const body = req.body;
//     const userIp = getClientIp(req);

//     // console.log("👉 User IP:", userIp);

//     const request = pool.request();

//     // LOGGING EACH INPUT BEFORE EXECUTION
//     const logInput = (name, value)=>{}
//       // console.log(`SQL Input: ${name} =`, value);


//     logInput("ref_id", body.ref_id);
//     request.input("ref_id", sql.VarChar(12), body.ref_id);

//     logInput("financial_year", body.financial_year);
//     request.input("financial_year", sql.VarChar(9), body.financial_year);

//     logInput("categary_cd", body.categary_cd);
//     request.input("categary_cd", sql.VarChar(2), body.categary_cd);

//     logInput("sno", body.sno);
//     request.input("sno", sql.Int, body.sno ? parseInt(body.sno, 10) : 0);

//     logInput("link_name", body.link_name);
//     request.input("link_name", sql.NVarChar(250), body.link_name);

//     logInput("file_data (buffer length)", file ? file.buffer.length : null);
//     request.input("file_data", sql.VarBinary(sql.MAX), file?.buffer);

//     logInput("content_type", file?.mimetype);
//     request.input("content_type", sql.NVarChar(100), file?.mimetype);

//     logInput("file_size_in_bytes", file?.size);
//     request.input("file_size_in_bytes", sql.Numeric(18, 0), file?.size);

//     logInput("user_id", body.user_id);
//     request.input("user_id", sql.VarChar(5), body.user_id);

//     logInput("user_name", body.user_name || "");
//     request.input("user_name", sql.NVarChar(100), body.user_name || "");

//     logInput("user_ip", userIp);
//     request.input("user_ip", sql.VarChar(20), userIp);

//     request.input("action", sql.VarChar(10), "post");
//     // console.log("SQL Input: action = post");

//     request.output("returnval", sql.Int);

//     // console.log("👉 Executing stored procedure: Client_FileUpload_CRUD");

//     const result = await request.execute("Client_FileUpload_CRUD");

//     // console.log("👉 Stored Procedure Result:", result);
//     // console.log("👉 Output returnval:", result.output.returnval);

//     // console.log("======== FILE UPLOAD DEBUG END ========");

//     return res.status(200).json({
//       status: result.output.returnval,
//       message: "Uploaded successfully",
//     });
//   } catch (err) {
//     console.error("Upload Error:", err);
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// };

// const updateFile = async (req, res) => {
//   try {
//     const { user_id, user_name } = req.body || {};
//     if (!user_id) return res.status(400).json({ error: "user_id required" });

//     // console.log("Update File:", req.body);

//     await poolConnect;
//     const file = req.file;
//     const body = req.body;
//     const userIp = getClientIp(req);

//     const request = pool.request();

//     request.input("ref_id", sql.VarChar(12), body.ref_id);
//     request.input("financial_year", sql.VarChar(9), body.financial_year);
//     request.input("sno", sql.Int, parseInt(body.sno, 10));
//     request.input("link_name", sql.NVarChar(250), body.link_name);

//     // FIX: Only one user_name input
//     request.input("user_name", sql.NVarChar(100), body.user_name || user_name || "");

//     request.input("file_data", sql.VarBinary(sql.MAX), file ? file.buffer : null);
//     request.input(
//       "file_size_in_bytes",
//       sql.Numeric(18, 0),
//       file ? file.size : body.file_size_in_bytes
//     );

//     request.input(
//       "content_type",
//       sql.NVarChar(100),
//       file ? file.mimetype : body.content_type
//     );

//     request.input("user_id", sql.VarChar(5), body.user_id);
//     request.input("user_ip", sql.VarChar(20), userIp);
//     request.input("action", sql.VarChar(10), "update");
//     request.output("returnval", sql.Int);

//     const result = await request.execute("Client_FileUpload_CRUD");

//     return res.status(200).json({
//       status: result.output.returnval,
//       message: "Updated successfully",
//     });
//   } catch (err) {
//     console.error("Update Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // ===================== DELETE FILE =====================

// const deleteFile = async (req, res) => {
//   try {
//     // console.log("DELETE Body:", req.body);

//     const { user_id, user_name } = req.body || {};
//     if (!user_id) return res.status(400).json({ error: "user_id required" });

//     await poolConnect;

//     const { ref_id, financial_year, sno } = req.params;
//     const userIp = getClientIp(req);

//     const request = pool.request();

//     request.input("ref_id", sql.VarChar(12), ref_id);
//     request.input("financial_year", sql.VarChar(9), financial_year);
//     request.input("sno", sql.Int, parseInt(sno, 10));
//     request.input("user_id", sql.VarChar(5), user_id);
//     request.input("user_name", sql.NVarChar(100), user_name || "");
//     request.input("user_ip", sql.VarChar(20), userIp);
//     request.input("action", sql.VarChar(10), "delete");
//     request.output("returnval", sql.Int);

//     const result = await request.execute("Client_FileUpload_CRUD");

//     return res.status(200).json({
//       status: result.output.returnval,
//       message: "Deleted successfully",
//     });
//   } catch (err) {
//     console.error("Delete Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// module.exports = {
//   getUploadCategories,
//   getFiles,
//   getFilesRef_Catcd,
//   uploadFile,
//   updateFile,
//   deleteFile,
// };




// ===================================
// ===================================
// ===================================
const { pool, sql, poolConnect } = require("../Database/dbConfig");
const getClientIp = require("../utils/getClientIp");

// ===================== GET UPLOAD CATEGORIES =====================
const getUploadCategories = async (req, res) => {
  try {
    await poolConnect;

    const { ref_id, financial_year } = req.query;

    const request = pool.request();
    request.input("ref_id", sql.VarChar(12), ref_id);
    request.input("financial_year", sql.VarChar(9), financial_year);

    const result = await request.execute("Client_GetUploadCategory");

    return res.status(200).json({
      status: 1,
      data: result.recordset, // contains cat_cd and cat_name
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

    const { ref_id, financial_year, categary_cd } = req.params; // FIXED

    const request = pool.request();
    request.input("ref_id", sql.VarChar(12), ref_id);
    request.input("financial_year", sql.VarChar(9), financial_year);
    request.input("categary_cd", sql.VarChar(2), categary_cd);

    request.input("action", sql.VarChar(10), "get");
    request.output("returnval", sql.Int);

    const result = await request.execute("Client_FileUpload_CRUD");

    return res.status(200).json({
      ref_id: req.params.ref_id,
      financial_year: req.params.financial_year,
      status: result.output.returnval,
      data: result.recordset,
    });
  } catch (err) {
    console.error("getFiles Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================Get uploaded file ref_id and categary_cd===========================

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



// const uploadFile = async (req, res) => {
//   try {
//     // console.log("======== FILE UPLOAD DEBUG START ========");

//     await poolConnect;

//     // LOG BODY & FILE
//     // console.log("👉 req.body:", req.body);
//     // console.log("👉 req.file:", req.file ? {
//     //   originalname: req.file.originalname,
//     //   mimetype: req.file.mimetype,
//     //   size: req.file.size
//     // } : "NO FILE RECEIVED");

//     const file = req.file;
//     const body = req.body;
//     const userIp = getClientIp(req);

//     // console.log("👉 User IP:", userIp);

//     const request = pool.request();

//     // LOGGING EACH INPUT BEFORE EXECUTION
//     const logInput = (name, value)=>{}
//       // console.log(`SQL Input: ${name} =`, value);


//     logInput("ref_id", body.ref_id);
//     request.input("ref_id", sql.VarChar(12), body.ref_id);

//     logInput("financial_year", body.financial_year);
//     request.input("financial_year", sql.VarChar(9), body.financial_year);

//     logInput("categary_cd", body.categary_cd);
//     request.input("categary_cd", sql.VarChar(2), body.categary_cd);

//     logInput("sno", body.sno);
//     request.input("sno", sql.Int, body.sno ? parseInt(body.sno, 10) : 0);

//     logInput("link_name", body.link_name);
//     request.input("link_name", sql.NVarChar(250), body.link_name);

//     logInput("file_data (buffer length)", file ? file.buffer.length : null);
//     request.input("file_data", sql.VarBinary(sql.MAX), file?.buffer);

//     logInput("content_type", file?.mimetype);
//     request.input("content_type", sql.NVarChar(100), file?.mimetype);

//     logInput("file_size_in_bytes", file?.size);
//     request.input("file_size_in_bytes", sql.Numeric(18, 0), file?.size);

//     logInput("user_id", body.user_id);
//     request.input("user_id", sql.VarChar(5), body.user_id);

//     logInput("user_name", body.user_name || "");
//     request.input("user_name", sql.NVarChar(100), body.user_name || "");

//     logInput("user_ip", userIp);
//     request.input("user_ip", sql.VarChar(20), userIp);

//     request.input("action", sql.VarChar(10), "post");
//     // console.log("SQL Input: action = post");

//     request.output("returnval", sql.Int);

//     // console.log("👉 Executing stored procedure: Client_FileUpload_CRUD");

//     const result = await request.execute("Client_FileUpload_CRUD");

//     // console.log("👉 Stored Procedure Result:", result);
//     // console.log("👉 Output returnval:", result.output.returnval);

//     // console.log("======== FILE UPLOAD DEBUG END ========");

//     return res.status(200).json({
//       status: result.output.returnval,
//       message: "Uploaded successfully",
//     });
//   } catch (err) {
//     console.error("Upload Error:", err);
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// };
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    const {
      ref_id,
      financial_year,
      categary_cd,
      link_name,
      user_id,
      user_name = ""
    } = req.body;

    if (!ref_id || !financial_year || !categary_cd || !link_name || !user_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await poolConnect;

    const file = req.file;
    const userIp = getClientIp(req);
    const path = "D:/Projects/CG-Samvad-Client/Server/uploads/" + link_name
    const request = pool.request();

    request.input("ref_id", sql.VarChar(12), ref_id);
    request.input("financial_year", sql.VarChar(9), financial_year);
    request.input("categary_cd", sql.VarChar(2), categary_cd);
    request.input("sno", sql.Int, 0);
    request.input("link_name", sql.NVarChar(250), path);

    request.input("file_data", sql.VarBinary(sql.MAX), file.buffer);
    request.input("content_type", sql.NVarChar(100), file.mimetype);
    request.input("file_size_in_bytes", sql.Numeric(18, 0), Number(file.size));

    request.input("user_id", sql.VarChar(5), user_id);
    request.input("user_name", sql.NVarChar(100), user_name);
    request.input("user_ip", sql.VarChar(20), userIp);

    request.input("action", sql.VarChar(10), "post");
    request.output("returnval", sql.Int);

    const result = await request.execute("Client_FileUpload_CRUD");

    return res.status(200).json({
      status: result.output.returnval,
      message: "Uploaded successfully",
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateFile = async (req, res) => {
  try {
    const { user_id, user_name } = req.body || {};
    if (!user_id) return res.status(400).json({ error: "user_id required" });

    // console.log("Update File:", req.body);

    await poolConnect;
    const file = req.file;
    const body = req.body;
    const userIp = getClientIp(req);

    const request = pool.request();

    request.input("ref_id", sql.VarChar(12), body.ref_id);
    request.input("financial_year", sql.VarChar(9), body.financial_year);
    request.input("sno", sql.Int, parseInt(body.sno, 10));
    request.input("link_name", sql.NVarChar(250), body.link_name);

    // FIX: Only one user_name input
    request.input("user_name", sql.NVarChar(100), body.user_name || user_name || "");

    request.input("file_data", sql.VarBinary(sql.MAX), file ? file.buffer : null);
    request.input(
      "file_size_in_bytes",
      sql.Numeric(18, 0),
      file ? file.size : body.file_size_in_bytes
    );

    request.input(
      "content_type",
      sql.NVarChar(100),
      file ? file.mimetype : body.content_type
    );

    request.input("user_id", sql.VarChar(5), body.user_id);
    request.input("user_ip", sql.VarChar(20), userIp);
    request.input("action", sql.VarChar(10), "update");
    request.output("returnval", sql.Int);

    const result = await request.execute("Client_FileUpload_CRUD");

    return res.status(200).json({
      status: result.output.returnval,
      message: "Updated successfully",
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ===================== DELETE FILE =====================

const deleteFile = async (req, res) => {
  try {
    // console.log("DELETE Body:", req.body);

    const { user_id, user_name } = req.body || {};
    if (!user_id) return res.status(400).json({ error: "user_id required" });

    await poolConnect;

    const { ref_id, financial_year, sno } = req.params;
    const userIp = getClientIp(req);

    const request = pool.request();

    request.input("ref_id", sql.VarChar(12), ref_id);
    request.input("financial_year", sql.VarChar(9), financial_year);
    request.input("sno", sql.Int, parseInt(sno, 10));
    request.input("user_id", sql.VarChar(5), user_id);
    request.input("user_name", sql.NVarChar(100), user_name || "");
    request.input("user_ip", sql.VarChar(20), userIp);
    request.input("action", sql.VarChar(10), "delete");
    request.output("returnval", sql.Int);

    const result = await request.execute("Client_FileUpload_CRUD");

    return res.status(200).json({
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