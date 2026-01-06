const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

/**
 * =========================
 * GET GST DETAILS
 * =========================
 */
const getGstDetails = async (req, res) => {
  console.log("Backend: GET GST Details");

  try {
    await poolConnect;

    const { user_id } = req.params;

    const result = await pool
      .request()
      .input("user_id", sql.VarChar(5), user_id)
      .input("action", sql.VarChar(10), "get")
      .output("returnval", sql.Int)
      .execute("NP_GSTDetail_CRUD");

    const returnValue = result.output.returnval;

    if (returnValue === -1) {
      return res.status(400).json({
        success: false,
        message: "Invalid user_id",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.recordset[0] || {},
    });
  } catch (err) {
    console.error("Error: GET GST Details", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/**
 * =========================
 * CHECK GST EXISTS
 * =========================
 */
const checkGstExists = async (req, res) => {
  console.log("Backend: CHECK GST Exists");

  try {
    await poolConnect;

    const { user_id } = req.params;

    const result = await pool
      .request()
      .input("user_id", sql.VarChar(5), user_id)
      .input("action", sql.VarChar(20), "is_gst_exists")
      .output("returnval", sql.Int)
      .execute("NP_GSTDetail_CRUD");

    const returnValue = result.output.returnval;

    if (returnValue === -1) {
      return res.status(400).json({
        success: false,
        message: "Invalid user_id",
      });
    }

    return res.status(200).json({
      success: true,
      exists: result.recordset[0]?.is_gst_exists === "Y",
    });
  } catch (err) {
    console.error("Error: CHECK GST Exists", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/**
 * =========================
 * UPDATE GST DETAILS
 * =========================
 */
const updateGstDetails = async (req, res) => {
  console.log("Backend: UPDATE GST Details");

  try {
    await poolConnect;

    const {
      user_id,
      GST_legalName,
      GST_number,
      GST_StateID,
      GST_StateText,
      GST_DateOfRegistration,
      GST_TaxpayerType,
      ip_address,
    } = req.body;

    // Step 1: Fetch existing values
    const existing = await pool
      .request()
      .input("user_id", sql.VarChar(5), user_id)
      .query(`
        SELECT GST_legalName, GST_number, GST_StateID, GST_StateText,
               GST_DateOfRegistration, GST_TaxpayerType
        FROM NewsPaper
        WHERE np_cd = (
          SELECT np_cd
          FROM NPUser_Login
          WHERE user_id = @user_id
            AND status = 1
        )
        AND status = 1
      `);

    if (!existing.recordset.length) {
      return res.status(404).json({
        success: false,
        message: "GST record not found",
      });
    }

    const old = existing.recordset[0];

    // Step 2: Detect changes
    const noChange =
      old.GST_legalName === GST_legalName &&
      old.GST_number === GST_number &&
      old.GST_StateID === GST_StateID &&
      old.GST_StateText === GST_StateText &&
      (old.GST_DateOfRegistration
        ? old.GST_DateOfRegistration.toISOString().split("T")[0]
        : null) === GST_DateOfRegistration &&
      old.GST_TaxpayerType === GST_TaxpayerType;

    if (noChange) {
      return res.status(200).json({
        success: false,
        message: "No changes detected",
      });
    }

    // Step 3: Parse date safely
    const parsedDate = GST_DateOfRegistration
      ? new Date(GST_DateOfRegistration)
      : null;

    // Step 4: Update via SP
    const result = await pool
      .request()
      .input("user_id", sql.VarChar(5), user_id)
      .input("GST_legalName", sql.NVarChar(100), GST_legalName)
      .input("GST_number", sql.VarChar(15), GST_number)
      .input("GST_StateID", sql.VarChar(10), GST_StateID)
      .input("GST_StateText", sql.NVarChar(50), GST_StateText)
      .input("GST_DateOfRegistration", sql.Date, parsedDate)
      .input("GST_TaxpayerType", sql.NVarChar(20), GST_TaxpayerType)
      .input("ip_address", sql.VarChar(14), ip_address)
      .input("action", sql.VarChar(10), "update")
      .output("returnval", sql.Int)
      .execute("NP_GSTDetail_CRUD");

    if (result.output.returnval === -1) {
      return res.status(400).json({
        success: false,
        message: "Validation failed — missing required fields",
      });
    }

    return res.status(200).json({
      success: true,
      message: "GST details updated successfully",
    });
  } catch (err) {
    console.error("Error: UPDATE GST", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getGstDetails,
  checkGstExists,
  updateGstDetails,
};
