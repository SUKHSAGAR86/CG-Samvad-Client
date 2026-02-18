const sql= require("mssql");


const config = {
  user: "sa",
  password: "nic",
  server: process.env.DB_SERVER,
  database: "samvad_client",
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