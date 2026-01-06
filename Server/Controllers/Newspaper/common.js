const { pool, sql } = require("../../Database/dbConfig.js");

const getStates = async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM [samvad_np].[dbo].[StateMaster]
    `;

    const result = await pool.request().query(query);

    return res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error fetching States list:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching States",
    });
  }
};

const getDistricts = async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM [dbo].[DistrictMaster]
    `;

    const result = await pool.request().query(query);

    return res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error fetching District list:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching District data",
    });
  }
};

module.exports = {
  getStates,
  getDistricts,
};
