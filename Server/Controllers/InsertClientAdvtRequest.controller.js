const { pool, sql, poolConnect } = require("../Database/dbConfig.js");

const insertClientAdvtRequest = async (req, res) => {
  try {
    await poolConnect;
    const {
      ref_id,
      financial_year,
      subject,
      client_sno_key,
      client_cd,
      tender_amt,
      base_dept_code,
      office_code,
      office_level_code,
      section_code,
      district_code,
      letter_no,
      letter_date,
      caption_cd,
      schedule_date,
      entry_date,
      entry_time,
      ip_address,
      user_id,
      remarks,
      fixed_date,
      print_in_national_np,
      print_in_local_np,
      print_in_state_np,
      print_in_other_np,
      print_in_other_remark,
      delete_status,
      forward_status,
      ref_Category_text,
      ref_Category_id
    } = req.body;

    const result = await pool.request()
      .input('ref_id', sql.VarChar(12), ref_id)
      .input('financial_year', sql.VarChar(9), financial_year)
      .input('subject', sql.NVarChar(200), subject)
      .input('client_sno_key', sql.BigInt, client_sno_key)
      .input('client_cd', sql.VarChar(10), client_cd)
      .input('tender_amt', sql.Numeric(10, 2), tender_amt)
      .input('base_dept_code', sql.VarChar(4), base_dept_code)
      .input('office_code', sql.VarChar(10), office_code)
      .input('office_level_code', sql.VarChar(10), office_level_code)
      .input('section_code', sql.VarChar(11), section_code)
      .input('district_code', sql.VarChar(2), district_code)
      .input('letter_no', sql.NVarChar(150), letter_no)
      .input('letter_date', sql.Date, letter_date)
      .input('caption_cd', sql.VarChar(3), caption_cd)
      .input('schedule_date', sql.Date, schedule_date)
      .input('entry_date', sql.Date, entry_date)
      .input('entry_time', sql.VarChar(20), entry_time)
      .input('ip_address', sql.VarChar(20), ip_address)
      .input('user_id', sql.VarChar(5), user_id)
      .input('remarks', sql.NVarChar(300), remarks)
      .input('fixed_date', sql.VarChar(1), fixed_date)
      .input('print_in_national_np', sql.Int, print_in_national_np)
      .input('print_in_local_np', sql.Int, print_in_local_np)
      .input('print_in_state_np', sql.Int, print_in_state_np)
      .input('print_in_other_np', sql.Int, print_in_other_np)
      .input('print_in_other_remark', sql.NVarChar(200), print_in_other_remark)
      .input('delete_status', sql.Char(1), delete_status)
      .input('forward_status', sql.Char(1), forward_status)
      .input('ref_Category_text', sql.VarChar(50), ref_Category_text)
      .input('ref_Category_id', sql.VarChar(3), ref_Category_id)
      .execute("Sp_Insert_Client_Advt_Request");

    res.status(200).json({ success: true, message: "Inserted successfully" });
  } catch (err) {
    console.error("SQL Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { insertClientAdvtRequest };
