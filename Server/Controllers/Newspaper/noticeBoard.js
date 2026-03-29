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
const fakeNotices = [
  {
    Sno: 101,
    Information: "System maintenance scheduled on Sunday.",
    notice_for_user_type: "NPUsers",
    Is_Active: "Y",
    From_date: "2026-01-05",
    To_Date: "2026-01-06",
    entry_date: "05/01/2026",
  },
  {
    Sno: 102,
    Information: "New dashboard feature released.",
    notice_for_user_type: "NPUsers",
    Is_Active: "Y",
    From_date: "2026-01-03",
    To_Date: "2026-01-10",
    entry_date: "03/01/2026",
  },
  {
    Sno: 103,
    Information: "Office closed on Republic Day.",
    notice_for_user_type: "NPUsers",
    Is_Active: "Y",
    From_date: "2026-01-26",
    To_Date: "2026-01-26",
    entry_date: "26/01/2026",
  },
];

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

/**
 * FAKE NOTICE BOARD API (NO DB)
 */
const fakeNoticeBoard = async (req, res) => {
  try {
    const cleanedData = fakeNotices.map((item) => ({
      ...item,
      Information: stripHtml(item.Information),
    }));

    return res.status(200).json({
      success: true,
      fake: true,
      count: cleanedData.length,
      data: cleanedData,
    });
  } catch (error) {
    console.error("Error in fake notice board:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching fake notice board data",
    });
  }
};


module.exports = {
  noticeBoard,
  fakeNoticeBoard,
};