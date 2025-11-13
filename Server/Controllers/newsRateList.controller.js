const { pool, poolConnect, sql } = require("../Database/dbConfig.js");

// 🟢 Combined: Fetch all active newspapers + their NPRate details
const getNewsPaperWithRates = async (req, res) => {
  try {
    await poolConnect;

    // Outer query → Active newspapers + count
   
    const outerResult = await pool.request()
    
    .query(`SELECT DISTINCT 
        (SELECT COUNT(DISTINCT NPRate.np_cd) 
         FROM NPRate 
         INNER JOIN NewsPaper ON NPRate.np_cd = NewsPaper.np_cd 
         WHERE (NPRate.to_date >= GETDATE()) 
           AND NewsPaper.status = '1') AS total_count,
        NewsPaper_1.np_cd, 
        NewsPaper_1.np_name + ' - ' + NewsPaper_1.edition AS NP
      FROM NPRate AS NPRate_1 
      INNER JOIN NewsPaper AS NewsPaper_1 
        ON NPRate_1.np_cd = NewsPaper_1.np_cd
      WHERE (NPRate_1.to_date >= GETDATE()) 
        AND NewsPaper_1.status = '1'
      ORDER BY NP;
    `);
    const newspapers = outerResult.recordset;

    // If no active newspapers found
    if (!newspapers || newspapers.length === 0) {
      return res.status(200).json([]);
    }

    // Inner query (parameterized)
    const innerResult = await pool.request()
    .query( `
      SELECT 
        NPRate.np_cd,
        NPRate.rate_cd, 
        NPRate.no_of_circulation, 
        CAST(NPRate.rate AS nvarchar) + ' ' + UnitMaster.unit AS cc_rate, 
        NPRate.remark, 
        CONVERT(varchar(12), NPRate.from_date, 103) AS from_date, 
        CONVERT(varchar(12), NPRate.to_date, 103) AS to_date, 
        RateCategory.rate_category_name, 
        UnitMaster.unit_id,
        RateConvert.to_unit_cd, 
        NPRate.sc_rate AS sc_rate
      FROM NPRate 
      INNER JOIN RateCategory ON NPRate.rate_category_cd = RateCategory.rate_category_cd 
      INNER JOIN UnitMaster ON NPRate.unit_id = UnitMaster.unit_id 
      INNER JOIN NewsPaper ON NPRate.np_cd = NewsPaper.np_cd 
      INNER JOIN RateConvert ON UnitMaster.unit_id = RateConvert.from_unit_cd 
      INNER JOIN UnitMaster AS UnitMaster_1 ON RateConvert.to_unit_cd = UnitMaster_1.unit_id
      WHERE NPRate.to_date >= GETDATE() 
        AND NewsPaper.status = '1';
    `);
    const allRates = innerResult.recordset;

    // Merge child rates with parent newspapers
    const mergedData = newspapers.map((np,index) => {
      const rates = allRates.filter(r => r.np_cd === np.np_cd);
      return {
        sr_no:index+1,
        np_cd: np.np_cd,
        NP: np.NP,
        count: np.total_count,
        rates: rates
      };
    });

    res.status(200).json(mergedData);

  } catch (error) {
    console.error("Error fetching newspapers with NPRate details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getNewsPaperWithRates
};
