const { pool, sql, poolConnect } = require("../Database/dbConfig.js");

/**
 * 🎯 Add SQL Parameters (Perfectly Aligned With SP)
 */
function addSqlParams(request, body) {
  // Basic Fields
  request.input("ref_id", sql.VarChar(12), body.ref_id || null);
  request.input("financial_year", sql.VarChar(9), body.financial_year || null);
  request.input("subject", sql.NVarChar(200), body.subject || null);

  // Auto-Fetched Fields (SP handles internally)
  request.input("client_sno_key", sql.BigInt, body.client_sno_key || null);
  request.input("client_cd", sql.VarChar(10), body.client_cd || null);

  request.input("tender_amt", sql.Numeric(10, 2), body.tender_amt ?? 0);
  request.input("base_dept_code", sql.VarChar(4), body.base_dept_code || null);
  request.input("office_code", sql.VarChar(10), body.office_code || null);
  request.input("office_level_code", sql.VarChar(10), body.office_level_code || null);
  request.input("section_code", sql.VarChar(11), body.section_code || null);
  request.input("district_code", sql.VarChar(2), body.district_code || null);

  // Letter fields
  request.input("letter_no", sql.NVarChar(150), body.letter_no || null);

  request.input("letter_date", sql.Date,body.letter_date ? new Date(body.letter_date) : null  );

  request.input("caption_cd", sql.VarChar(3), body.caption_cd || null);

  request.input("schedule_date",sql.Date,body.schedule_date ? new Date(body.schedule_date) : null);

  // System info
  request.input("ip_address", sql.VarChar(20), body.ip_address || null);
  request.input("user_id", sql.VarChar(5), body.user_id || null);

  request.input("entry_date",sql.Date,body.entry_date ? new Date(body.entry_date) : null
  );

  request.input("entry_time", sql.VarChar(20), body.entry_time || null);
  request.input("remarks", sql.NVarChar(300), body.remarks || null);

  request.input("fixed_date", sql.VarChar(1), body.fixed_date || null);


  request.input("print_in_national_np", sql.Int, body.print_in_national_np ?? 0);
  request.input("print_in_local_np", sql.Int, body.print_in_local_np ?? 0);
  request.input("print_in_state_np", sql.Int, body.print_in_state_np ?? 0);
  request.input("print_in_other_np", sql.Int, body.print_in_other_np ?? 0);
  request.input("print_in_other_remark",sql.NVarChar(200),body.print_in_other_remark || null);

  request.input("delete_status", sql.Char(1), body.delete_status || "N");
  request.input("forward_status", sql.Char(1), body.forward_status || "N");

  request.input("ref_Category_text", sql.VarChar(50), body.ref_Category_text || null);
  request.input("ref_Category_id", sql.VarChar(3), body.ref_Category_id || null);

request.input("action", sql.VarChar(10), "post");

  // OUTPUT PARAMETER
  request.output("returnval", sql.Int);
}

/**
 *Controller Function
 */
const insertClientAdvtRequest = async (req, res) => {
  try {
    await poolConnect;

    const request = pool.request();

    // Add inputs to SQL
    addSqlParams(request, req.body);

    // Execute Stored Procedure
    const result = await request.execute("Sp_Insert_Client_Advt_Request");

    return res.status(200).json({
      success: true,
      message: "data submited successfully",
      data: result.recordset || [],
      output: result.output,
      returnval: result.output.returnval,
    });

  } catch (error) {
    console.error("SP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error executing SP",
      error: error.message,
    });
  }
};

module.exports = { insertClientAdvtRequest,};