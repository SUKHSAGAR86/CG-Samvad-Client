const sql = require("mssql");
const { pool, poolConnect } = require("../../Database/dbConfig");

/* GET ALL */
const getAllLoginType = async (req, res) => {
  try {
    await poolConnect; // ensure pool is connected

    const result = await pool.request().query(`
      SELECT 
        id,
        login_user_type_code,
        login_user_type_name,
        login_path,
        status,
        display_order
    FROM dbo.User_Login_Type where status=1
      ORDER BY display_order
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET BY CODE */
const getLoginTypeByid = async (req, res) => {
  try {
    await poolConnect;

    const result = await pool
      .request()
      .input("id", sql.VarChar(20), req.params.id)
      .query(`
        SELECT *
        FROM User_Login_Type
        WHERE id = @id and status=1
      `);

    res.status(200).json(result.recordset[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getfinancialYear = async (req, res) => {
  try {
    await poolConnect; // ensure pool is connected

    const result = await pool.request().query(`
      
select financial_year from FinancialYear where status= 1
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllLoginType,
 getLoginTypeByid,
 getfinancialYear,
};
