const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const bodyParser = require("body-parser");

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());
app.use("/api/teachers", require("./routes/teacherRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));


module.exports = app;   