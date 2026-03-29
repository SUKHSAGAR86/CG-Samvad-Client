//const { sql, poolconnect } = require("../db");
const { pool, poolConnect, sql } = require("../database/dbConfig.js");

/**
 * 1️⃣ Get Full Menu Hierarchy
 */
const getUserMenu = async (req, res) => {
  try {
    const { user_id, user_type } = req.query;

    await poolConnect;

    const result = await pool
      .request()
      .input("user_id", sql.VarChar, user_id)
      .input("user_type", sql.VarChar, user_type)
      .execute("GetUserMenuHierarchy");
    console.log(result)
    const data = result.recordset;

    const menuMap = {};

    data.forEach(row => {
      if (!menuMap[row.menu_cd]) {
        menuMap[row.menu_cd] = {
          menu_cd: row.menu_cd,
          menu_nm: row.menu_nm,
          submenus: {},
        };
      }

      if (row.sub_menu_code) {
        if (!menuMap[row.menu_cd].submenus[row.sub_menu_code]) {
          menuMap[row.menu_cd].submenus[row.sub_menu_code] = {
            sub_menu_code: row.sub_menu_code,
            sub_menu_nm: row.sub_menu_nm,
            forms: [],
          };
        }

        menuMap[row.menu_cd].submenus[row.sub_menu_code].forms.push({
          forms_code: row.forms_code,
          form_display_name: row.form_display_name,
        });
      }
    });

    const response = Object.values(menuMap).map(menu => ({
      ...menu,
      submenus: Object.values(menu.submenus),
    }));

    res.json({ success: true, data: response });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * 2️⃣ Get Only Menus (Basic API)
 */
const getMenusOnly = async (req, res) => {
  try {
    const { user_id, user_type } = req.query;

    await poolConnect;

    const result = await pool.request()
      .input("user_id", sql.VarChar, user_id)
      .input("user_type", sql.VarChar, user_type)
      .query(`
        SELECT DISTINCT UM.menu_cd, UM.menu_nm
        FROM UserMenu UM
        INNER JOIN FormMaster FM ON UM.menu_cd = FM.menu_cd
        INNER JOIN forms_of_user_type FUT ON FM.forms_code = FUT.forms_code
        INNER JOIN UserAuthentication UA 
          ON FUT.forms_code = UA.form_cd
        WHERE 
          FUT.user_type_code = @user_type
          AND UA.user_id = @user_id
      `);

    res.json({ success: true, data: result.recordset });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * 3️⃣ Get Submenus by Menu
 */
const getSubMenus = async (req, res) => {
  try {
    const { menu_cd } = req.query;

    await poolConnect;

    const result = await pool.request()
      .input("menu_cd", sql.VarChar, menu_cd)
      .query(`
        SELECT sub_menu_code, sub_menu_nm
        FROM SubMenuMaster
        WHERE main_menu_code = @menu_cd
      `);

    res.json({ success: true, data: result.recordset });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = {
  getUserMenu,
  getMenusOnly,
  getSubMenus
};