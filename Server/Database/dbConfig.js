const sql= require("mssql");


const config={
    user:"sa",
    password:"nic",
    server:"localhost",
    database :"samvad_client",
    port:1433,
    options:{
        encrypt:false,
        trustServerCertificate:true,
        },
    };

    const pool=new sql.ConnectionPool(config);
    // Connect once and handle connection errors properly
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