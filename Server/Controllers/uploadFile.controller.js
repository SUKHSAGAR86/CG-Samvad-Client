
// const { pool, sql, poolConnect } = require("../Database/dbConfig");
// const getClientIp = require("../utils/getClientIp");

// // ===================== GET FILES =====================
// const getFiles = async (req, res) => {
//   try {
//     await poolConnect;

//     const { ref_id, financial_year, categary_cd } = req.params;   // FIXED

//     const request = pool.request();
//     request.input("ref_id", sql.VarChar(12), ref_id);
//     request.input("financial_year", sql.VarChar(9), financial_year);
//     request.input("categary_cd", sql.VarChar(2), categary_cd);     // FIXED
//     request.input("action", sql.VarChar(10), "get");
//     request.output("returnval", sql.Int);

//     const result = await request.execute("Client_FileUpload_CRUD");

//     return res.status(200).json({
//        ref_id:req.params.ref_id,
//        financial_year:req.params.financial_year,
//       status: result.output.returnval,
//       data: result.recordset,
//     });

//   } catch (err) {
//     console.error("getFiles Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // ===================== UPLOAD FILE =====================
// const uploadFile = async (req, res) => {
//   try {
//     await poolConnect;

//     const file = req.file;
//     const body = req.body;
//     const userIp = getClientIp(req);

//     const request = pool.request();

//     request.input("ref_id", sql.VarChar(12), body.ref_id);
//     request.input("financial_year", sql.VarChar(9), body.financial_year);
//     request.input("categary_cd", sql.VarChar(2), body.categary_cd);   // FIXED
//     request.input("sno", sql.Int, body.sno ? parseInt(body.sno, 10) : 0);
//     request.input("link_name", sql.NVarChar(250), body.link_name);
//     request.input("advt_file_path", sql.NVarChar(sql.MAX), null);
//     request.input("file_data", sql.VarBinary(sql.MAX), file.buffer);
//     request.input("content_type", sql.NVarChar(100), file.mimetype);
//     request.input("file_size_in_bytes", sql.Numeric(18, 0), file.size);
//     request.input("user_id", sql.VarChar(5), body.user_id);
//     request.input("user_name", sql.NVarChar(100), body.user_name || "");
//     request.input("user_ip", sql.VarChar(20), userIp);
//     request.input("action", sql.VarChar(10), "post");
//     request.output("returnval", sql.Int);

//     const result = await request.execute("Client_FileUpload_CRUD");

//     return res.status(200).json({
//       status: result.output.returnval,
//       message: "Uploaded successfully",
//     });

//   } catch (err) {
//     console.error("Upload Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // ===================== UPDATE FILE =====================
// const updateFile = async (req, res) => {
//   try {
//     await poolConnect;

//     const file = req.file;
//     const body = req.body;
//     const userIp = getClientIp(req);

//     const request = pool.request();

//     request.input("ref_id", sql.VarChar(12), body.ref_id);
//     request.input("financial_year", sql.VarChar(9), body.financial_year);
//     request.input("sno", sql.Int, parseInt(body.sno, 10));
//     request.input("link_name", sql.NVarChar(250), body.link_name);
//     request.input("file_data", sql.VarBinary(sql.MAX), file ? file.buffer : null);
//     request.input("file_size_in_bytes", sql.Numeric(18, 0), file ? file.size : body.file_size_in_bytes);
//     request.input("content_type", sql.NVarChar(100), file ? file.mimetype : body.content_type);
//     request.input("user_id", sql.VarChar(5), body.user_id);
//     request.input("user_name", sql.NVarChar(100), body.user_name || "");
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
//     await poolConnect;

//     const { ref_id, financial_year, sno } = req.params;
//     const { user_id, user_name } = req.body;
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
//   getFiles,
//   uploadFile,
//   updateFile,
//   deleteFile,
// };






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

    const { ref_id, financial_year, categary_cd } = req.params;   // FIXED

    const request = pool.request();
    request.input("ref_id", sql.VarChar(12), ref_id);
    request.input("financial_year", sql.VarChar(9), financial_year);
    request.input("categary_cd", sql.VarChar(2), categary_cd);     // FIXED
    request.input("action", sql.VarChar(10), "get");
    request.output("returnval", sql.Int);

    const result = await request.execute("Client_FileUpload_CRUD");

    return res.status(200).json({
       ref_id:req.params.ref_id,
       financial_year:req.params.financial_year,
      status: result.output.returnval,
      data: result.recordset,
    });

  } catch (err) {
    console.error("getFiles Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ===================== UPLOAD FILE =====================
const uploadFile = async (req, res) => {
  try {
    await poolConnect;

    const file = req.file;
    const body = req.body;
    const userIp = getClientIp(req);

    const request = pool.request();

    request.input("ref_id", sql.VarChar(12), body.ref_id);
    request.input("financial_year", sql.VarChar(9), body.financial_year);
    request.input("categary_cd", sql.VarChar(2), body.categary_cd);   // FIXED
    request.input("sno", sql.Int, body.sno ? parseInt(body.sno, 10) : 0);
    request.input("link_name", sql.NVarChar(250), body.link_name);
    request.input("advt_file_path", sql.NVarChar(sql.MAX), null);
    request.input("file_data", sql.VarBinary(sql.MAX), file.buffer);
    request.input("content_type", sql.NVarChar(100), file.mimetype);
    request.input("file_size_in_bytes", sql.Numeric(18, 0), file.size);
    request.input("user_id", sql.VarChar(5), body.user_id);
    request.input("user_name", sql.NVarChar(100), body.user_name || "");
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
    res.status(500).json({ error: "Server error" });
  }
};

// ===================== UPDATE FILE =====================
const updateFile = async (req, res) => {
  try {
    await poolConnect;

    const file = req.file;
    const body = req.body;
    const userIp = getClientIp(req);

    const request = pool.request();

    request.input("ref_id", sql.VarChar(12), body.ref_id);
    request.input("financial_year", sql.VarChar(9), body.financial_year);
    request.input("sno", sql.Int, parseInt(body.sno, 10));
    request.input("link_name", sql.NVarChar(250), body.link_name);
    request.input("file_data", sql.VarBinary(sql.MAX), file ? file.buffer : null);
    request.input("file_size_in_bytes", sql.Numeric(18, 0), file ? file.size : body.file_size_in_bytes);
    request.input("content_type", sql.NVarChar(100), file ? file.mimetype : body.content_type);
    request.input("user_id", sql.VarChar(5), body.user_id);
    request.input("user_name", sql.NVarChar(100), body.user_name || "");
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
    await poolConnect;

    const { ref_id, financial_year, sno } = req.params;
    const { user_id, user_name } = req.body;
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
  uploadFile,
  updateFile,
  deleteFile,
};
