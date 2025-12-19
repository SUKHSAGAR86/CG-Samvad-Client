const { pool, poolConnect } = require("../Database/dbConfig.js");

// Controller: Fetch active notices for ClientUsers
const getClientNotices = async (req, res) => {
  try {
    await poolConnect;

    
   
    const result = await pool
    .request()
    .query(`
      DECLARE @user_type VARCHAR(50);
SET @user_type = 'ClientUsers';
SELECT 
    Sno,
    Information,
    notice_for_user_type,
    Is_Active,
    From_date,
    To_Date,
    CONVERT(VARCHAR(10), entry_date, 103) AS entry_date
FROM NP_Information
WHERE is_active = 'Y'
  AND notice_for_user_type = @user_type
ORDER BY Sno DESC;
`);

    res.status(200).json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notices",
      error: error.message,
    });
  }
};

module.exports = { getClientNotices };
