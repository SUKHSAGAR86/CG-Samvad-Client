const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sha256 = require("sha256");
const multer = require("multer"); 

// Import routes
const authRoute = require("./Routes/auth.route.js");
const createNewRequest = require("./Routes/createNewRequest.route.js");
const insertClientAdvtRequest = require("./Routes/InsertClientAdvtRequest.route.js");
const clientNotices = require("./Routes/clientNotices.route.js");
const newsRateList = require("./Routes/newsRateList.route.js");
const newspaper = require("./Routes/newspaperRoutes.js");
const uploadFile = require("./Routes/uploadFile.route.js"); // Uncomment if you have this

const usersLogin=require("./Routes/user.login.route.js")

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.set("trust proxy", true);

// --- Debug function to check routes ---
function checkRoute(route, routeName) {
  console.log(`${routeName} -> type:`, typeof route);
  if (typeof route !== "function") {
    console.error(
      `❌ ${routeName} is NOT a valid Express router/function. Check the export!`
    );
  } else {
    console.log(`✅ ${routeName} looks good.`);
  }
}

// --- Check all routes ---
checkRoute(authRoute, "authRoute");
checkRoute(createNewRequest, "createNewRequest");
checkRoute(insertClientAdvtRequest, "insertClientAdvtRequest");
checkRoute(clientNotices, "clientNotices");
checkRoute(newsRateList, "newsRateList");
checkRoute(newspaper, "newspaper");
checkRoute(uploadFile, "uploadFile"); // Uncomment if using

// ===============userlogin==================
checkRoute(usersLogin,"usersLogin");


// --- Use routes safely ---
if (typeof authRoute === "function") app.use("/api/auth", authRoute);
if (typeof newspaper === "function") app.use("/api/newspaper", newspaper);

if (typeof createNewRequest === "function") app.use("/api", createNewRequest);
if (typeof insertClientAdvtRequest === "function") app.use("/api", insertClientAdvtRequest);
if (typeof clientNotices === "function") app.use("/api", clientNotices);
if (typeof newsRateList === "function") app.use("/api", newsRateList);
if (typeof uploadFile === "function") app.use("/api", uploadFile); // Uncomment if using


if(typeof usersLogin==="function") app.use("/api",usersLogin);
// --- Fallback route ---
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(3080, () => {
  console.log("Server is running at http://localhost:3080");
});
