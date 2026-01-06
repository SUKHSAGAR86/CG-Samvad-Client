const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

/**
 * GET ALL NEWSPAPERS
 */
const getNewspapers = async (req, res) => {
  try {
    await poolConnect;

    const query = `
      SELECT TOP (1000)
        np_cd,
        np_name,
        edition,
        type,
        language_id,
        language,
        status,
        rni_reg_no,
        bank_acount_no,
        bank_name,
        ifsc_code,
        display_order,
        who_created,
        is_eligible_for_gst,
        is_gst_verified_by_admin,
        CONTACT,
        DESN,
        NPADDR1,
        NPADDR2,
        NPADDR3,
        NPSTATE,
        NPSTATE_text,
        NPCITY,
        NPCITY_text,
        NPPOSTAL_cd,
        NPPHONE,
        YROPBAL,
        COMMPERC,
        NPNAME,
        GST_legalName,
        GST_number,
        GST_StateID,
        GST_StateText,
        GST_DateOfRegistration,
        GST_TaxpayerType,
        GST_Trade_Name,
        GST_DateOfIssue,
        State_Code,
        District_Code,
        State_Text,
        District_Text,
        entry_date,
        entry_time,
        ip_address,
        entry_by_user_id,
        entry_by_user_name,
        modify_date,
        modify_time,
        modify_ip_address,
        modify_by_user_id,
        modify_by_user_name,
        np_info
      FROM [samvad_np].[dbo].[NewsPaper]
    `;

    const result = await pool.request().query(query);

    res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

/**
 * GET NP USER WITH NEWSPAPER
 */
const getNpUserWithNewspaper = async (req, res) => {
  try {
    await poolConnect;

    const { user_id } = req.params;

    const query = `
      SELECT DISTINCT 
        NPUser_Login.user_id, 
        NPUser_Login.contact_no, 
        NPUser_Login.np_cd, 
        NPUser_Login.user_name, 
        NPUser_Login.std_code, 
        NPUser_Login.landline_no,
        NPUser_Login.email_id, 
        NPUser_Login.fax_no,
        NPUser_Login.address AS loginaddr, 
        NPUser_Login.status, 
        NewsPaper.District_Text,
        NewsPaper.District_Code,
        NewsPaper.State_Text,
        NewsPaper.State_Code,
        NewsPaper.np_name + '-' + NewsPaper.edition AS np_name,
        NewsPaper.NPADDR1 + ',' +
        ISNULL(NewsPaper.NPADDR2 + ',', '') +
        ISNULL(NewsPaper.NPADDR3 + ',', '') +
        NewsPaper.NPCITY_text + ',' +
        NewsPaper.NPSTATE_text + ',' +
        NewsPaper.NPPOSTAL_cd AS address
      FROM NewsPaper
      INNER JOIN NPUser_Login 
        ON NewsPaper.np_cd = NPUser_Login.np_cd
      WHERE NewsPaper.status = 1
        AND NPUser_Login.user_id = @user_id
    `;

    const result = await pool
      .request()
      .input("user_id", sql.VarChar, user_id)
      .query(query);

    if (!result.recordset.length) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

/**
 * NP PROFILE HANDLER
 */
const npProfileHandler = async (req, res) => {
  try {
    await poolConnect;

    const {
      user_id,
      user_name = null,
      email_id = null,
      landline_no = null,
      std_code = null,
      fax_no = null,
      address = null,
      contact_no = null,
      NPADDR1 = null,
      NPADDR2 = null,
      State_Text = null,
      State_Code = null,
      NPCITY = null,
      NPCITY_Text = null,
      NPPOSTAL_cd = null,
      ip_address = null,
      by_user_id = null,
      by_user_name = null,
      action,
    } = req.body;

    const request = pool.request();

    request.input("user_id", sql.VarChar(6), user_id);
    request.input("user_name", sql.NVarChar(50), user_name);
    request.input("email_id", sql.NVarChar(50), email_id);
    request.input("landline_no", sql.VarChar(10), landline_no);
    request.input("std_code", sql.VarChar(5), std_code);
    request.input("fax_no", sql.VarChar(15), fax_no);
    request.input("address", sql.NVarChar(300), address);
    request.input("contact_no", sql.VarChar(10), contact_no);
    request.input("NPADDR1", sql.NVarChar(100), NPADDR1);
    request.input("NPADDR2", sql.NVarChar(50), NPADDR2);
    request.input("State_Text", sql.VarChar(100), State_Text);
    request.input("State_Code", sql.VarChar(10), State_Code);
    request.input("NPCITY", sql.NVarChar(10), NPCITY);
    request.input("NPCITY_Text", sql.VarChar(50), NPCITY_Text);
    request.input("NPPOSTAL_cd", sql.NVarChar(10), NPPOSTAL_cd);
    request.input("ip_address", sql.VarChar(14), ip_address);
    request.input("by_user_id", sql.VarChar(10), by_user_id);
    request.input("by_user_name", sql.NVarChar(50), by_user_name);
    request.input("action", sql.VarChar(10), action);
    request.output("returnval", sql.Int);

    const result = await request.execute("NP_Profile_CRUD");

    res.status(200).json({
      status: result.output.returnval,
      data: result.recordset || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: -1, error: error.message });
  }
};

module.exports = {
  getNewspapers,
  getNpUserWithNewspaper,
  npProfileHandler,
};
