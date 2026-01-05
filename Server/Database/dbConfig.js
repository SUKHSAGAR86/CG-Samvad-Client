const sql= require("mssql");


const config = {
  user: "nikita_chhattani",
  password: "Nikita@8",
  server: "CSMBHUL1506\\SQLEXPRESS",
  database: "samvad_np",
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const pool=new sql.ConnectionPool(config);
const poolConnect = pool.connect()
  .then(() => console.log("SQL Server connected successfully"))
  .catch((err) => console.error(" SQL connection error:", err));

module.exports = {
  sql,
  pool,
  poolConnect,
};
    // const poolConnect=pool.connect();
    // module.exports={
    //     sql,pool,poolConnect,
    // };