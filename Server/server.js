// const express = require('express');
// const app = express();
// const port = 3081; // you can set it to 3000 if you want

// app.get('/', (req, res) => res.send('Hello World!'));

// app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));




const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sha256 = require("sha256");

// const authRoute = require("./routes/auth.route.js");

// const Adminuser=require("./routes/auth.route.js");




const createNewRequest=require("./Routes/createNewRequest.route.js");
const insertClientAdvtRequest=require("./Routes/InsertClientAdvtRequest.route.js");
const clientNotices =require("./Routes/clientNotices.route.js");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.set("trust proxy", true);

// FIXED PATHS
// app.use("/api/auth", authRoute);
// app.use("api/adminuser",Adminuser);

//----------------------------MasterEntry----------------------------------------------
app.use("/api",createNewRequest);
app.use("/api",insertClientAdvtRequest);
app.use("/api",clientNotices);




app.listen(3080, () => {
  console.log("Server is running at http://localhost:3080");
});
