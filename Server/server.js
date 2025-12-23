


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sha256 = require("sha256");
const multer = require("multer"); 

// const authRoute = require("./routes/auth.route.js");

// const Adminuser=require("./routes/auth.route.js");

const authRoute = require("./Routes/auth.route.js");


const createNewRequest=require("./Routes/createNewRequest.route.js");
const insertClientAdvtRequest = require("./Routes/InsertClientAdvtRequest.route.js")
const clientNotices=require("./Routes/clientNotices.route.js");
const newsRateList=require("./Routes/newsRateList.route.js");
const uploadFile=require("./Routes/uploadFile.route");






const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use("/uploads", express.static("uploads"));
// FIXED PATHS
app.use("/api/auth", authRoute);
// app.use("api/adminuser",Adminuser);


app.use("/api",createNewRequest);
app.use("/api",insertClientAdvtRequest)
app.use("/api",clientNotices);
app.use("/api",newsRateList);
app.use("/api",uploadFile);







app.listen(3080, () => {
  console.log("Server is running at http://localhost:3080");
});
