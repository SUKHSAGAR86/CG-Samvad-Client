const { pool, poolConnect, sql } = require("../../database/dbConfig.js");
const { htmlToText } = require("html-to-text");

/**
 * Strip HTML tags safely
 */
const stripHtml = (html) => {
  if (!html) return "";
  return htmlToText(html, {
    wordwrap: false,
    selectors: [
      { selector: "img", format: "skip" },
      { selector: "a", options: { ignoreHref: true } },
    ],
  }).trim();
};

/**
 * NOTICE BOARD API
 */
const noticeBoard = async (req, res) => {
  try {
    // ✅ ensure DB connection
    await poolConnect;

    const query = `
      SELECT 
        Sno,
        Information,
        notice_for_user_type,
        Is_Active,
        From_date,
        To_Date,
        CONVERT(VARCHAR(10), entry_date, 103) AS entry_date
      FROM NP_Information
      WHERE Is_Active = 'Y'
        AND notice_for_user_type = 'NPUsers'
      ORDER BY Sno DESC
    `;

    const result = await pool.request().query(query);

    // ✅ clean HTML
    const cleanedData = result.recordset.map((item) => ({
      ...item,
      Information: stripHtml(item.Information),
    }));

    return res.status(200).json({
      success: true,
      count: cleanedData.length,
      data: cleanedData,
    });
  } catch (error) {
    console.error("Error fetching notice board:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching notice board data",
    });
  }
};

module.exports = {
  noticeBoard,
};
