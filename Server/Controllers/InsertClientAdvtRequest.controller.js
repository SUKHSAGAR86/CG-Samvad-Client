
const { pool, sql, poolConnect } = require("../Database/dbConfig");

const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||   // proxy / hosting
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)
  );
};

// --------------------------- INSERT — action = 'post'----------------------------------


const insertClientAdvtRequest = async (req, res) => {
  try {
    await poolConnect;

    const body = req.body;
    const userIp = getClientIp(req);

    const request = pool.request();

    request.input("financial_year", sql.VarChar(9), body.financial_year);
    request.input("subject", sql.NVarChar(200), body.subject);
    request.input("client_sno_key", sql.BigInt, body.client_sno_key);
    request.input("client_cd", sql.VarChar(10), body.client_cd);
    request.input("tender_amt", sql.Numeric(10, 2), body.tender_amt);
    request.input("base_dept_code", sql.VarChar(4), body.base_dept_code);
    request.input("office_code", sql.VarChar(10), body.office_code);
    request.input("office_level_code", sql.VarChar(10), body.office_level_code);
    request.input("section_code", sql.VarChar(11), body.section_code);
    request.input("district_code", sql.VarChar(2), body.district_code);
    request.input("letter_no", sql.NVarChar(150), body.letter_no);
    request.input("letter_date", sql.Date, body.letter_date);
    request.input("caption_cd", sql.VarChar(3), body.caption_cd);
    request.input("schedule_date", sql.Date, body.schedule_date);

    // AUTO IP
    request.input("ip_address", sql.VarChar(20), userIp);

    request.input("user_id", sql.VarChar(5), body.user_id);
    request.input("entry_date", sql.Date, body.entry_date);
    request.input("entry_time", sql.VarChar(20), body.entry_time);
    request.input("remarks", sql.NVarChar(300), body.remarks);
    request.input("fixed_date", sql.VarChar(1), body.fixed_date);
    request.input("print_in_national_np", sql.Int, body.print_in_national_np);
    request.input("print_in_local_np", sql.Int, body.print_in_local_np);
    request.input("print_in_state_np", sql.Int, body.print_in_state_np);
    request.input("print_in_other_np", sql.Int, body.print_in_other_np);
    request.input("print_in_other_remark", sql.NVarChar(200), body.print_in_other_remark);
    request.input("delete_status", sql.Char(1), "N");
    request.input("forward_status", sql.Char(1), body.forward_status);
    request.input("ref_Category_text", sql.VarChar(50), body.ref_Category_text);
    request.input("ref_Category_id", sql.VarChar(3), body.ref_Category_id);

    request.input("action", sql.VarChar(10), "post");
    request.output("returnval", sql.Int);
    request.output("ref_id", sql.VarChar(12));

    const result = await request.execute("Sp_Insert_Client_Advt_Request");

    return res.status(200).json({
      status: result.output.returnval,
      message: result.output.returnval === 1 ? "Inserted successfully" : "Insert failed",
      ref_id: result.output.ref_id,
      ip_used: userIp,
    });

  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// -------------------------GET ALL — action = 'get'------------------------------------

const getAllRequests = async (req, res) => {
  try {
    await poolConnect;

    const { user_id, financial_year } = req.query;

    const request = pool.request();
    request.input("user_id", sql.VarChar(5), user_id);
    request.input("financial_year", sql.VarChar(9), financial_year);
    request.input("ref_id", sql.VarChar(10), "");
    request.input("action", sql.VarChar(10), "get");

    const result = await request.execute("Sp_Insert_Client_Advt_Request");

    return res.status(200).json(result.recordset);

  } catch (err) {
    console.error("Get All Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// ------------------------------GET BY ID — action = 'get_by_id'-------------------------------
const getRequestById = async (req, res) => {
  try {
    await poolConnect;

    const { ref_id } = req.params;
    const { user_id, financial_year } = req.query;

    const request = pool.request();
    request.output("ref_id", sql.VarChar(12), ref_id);
    request.input("user_id", sql.VarChar(5), user_id);
    request.input("financial_year", sql.VarChar(9), financial_year);
    request.input("action", sql.VarChar(10), "get_by_id");

    const result = await request.execute("Sp_Insert_Client_Advt_Request");

    return res.status(200).json(result.recordset[0] || {});

  } catch (err) {
    console.error("Get By ID Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// ------------------------UPDATE — action = 'update'-------------------------------------


const updateClientAdvtRequest = async (req, res) => {
  try {
    await poolConnect;

    const body = req.body;
    const userIp = getClientIp(req);

    const request = pool.request();

    request.input("ref_id", sql.VarChar(12), body.ref_id);
    request.input("financial_year", sql.VarChar(9), body.financial_year);
    request.input("subject", sql.NVarChar(200), body.subject);
    request.input("ref_Category_id", sql.VarChar(3), body.ref_Category_id);
    request.input("ref_Category_text", sql.VarChar(50), body.ref_Category_text);
    request.input("tender_amt", sql.Numeric(10, 2), body.tender_amt);
    request.input("letter_no", sql.NVarChar(150), body.letter_no);
    request.input("letter_date", sql.Date, body.letter_date);
    request.input("schedule_date", sql.Date, body.schedule_date);
    request.input("remarks", sql.NVarChar(300), body.remarks);
    request.input("fixed_date", sql.VarChar(1), body.fixed_date);
    request.input("print_in_national_np", sql.Int, body.print_in_national_np);
    request.input("print_in_local_np", sql.Int, body.print_in_local_np);
    request.input("print_in_state_np", sql.Int, body.print_in_state_np);
    request.input("print_in_other_np", sql.Int, body.print_in_other_np);
    request.input("print_in_other_remark", sql.NVarChar(200), body.print_in_other_remark);

    // Add missing user_id
    request.input("user_id", sql.VarChar(6), body.user_id);

    // AUTO IP
    request.input("ip_address", sql.VarChar(20), userIp);

    request.input("action", sql.VarChar(10), "update");
    request.output("returnval", sql.Int);

    const result = await request.execute("Sp_Insert_Client_Advt_Request");

    return res.status(200).json({
      status: result.output.returnval,
      message:
        result.output.returnval === 1 ? "Updated successfully" : "Update failed",
      ip_used: userIp,
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



// --------------DELETE — action = 'delete'-----------------------------------------------

const deleteClientAdvtRequest = async (req, res) => {
  try {
    await poolConnect;

    const { ref_id } = req.params;
    const { financial_year, user_id } = req.body;

    const userIp = getClientIp(req);

    const request = pool.request();

    request.input("ref_id", sql.VarChar(12), ref_id);
    request.input("financial_year", sql.VarChar(9), financial_year);

    // AUTO IP
    request.input("ip_address", sql.VarChar(20), userIp);

    request.input("user_id", sql.VarChar(5), user_id);
    request.input("delete_status", sql.Char(1), "Y");
    request.input("action", sql.VarChar(20), "delete");

    request.output("returnval", sql.Int);

    const result = await request.execute("Sp_Insert_Client_Advt_Request");

    return res.status(200).json({
      status: result.output.returnval,
      ref_id,
      ip_used: userIp,
      message:
        result.output.returnval === 1
          ? `Deleted successfully (Ref ID: ${ref_id})`
          : "Delete failed",
    });

  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  insertClientAdvtRequest,
  getAllRequests,
  getRequestById,
  updateClientAdvtRequest,
  deleteClientAdvtRequest,
};
