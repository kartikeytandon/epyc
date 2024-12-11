const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();
connectDB();

const app = express();
app.use("/api/teachers", require("./routes/teacherRoutes"));

module.exports = app;