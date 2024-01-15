const express = require("express");
const path = require("path")

const app = express();
const cors = require("cors")
PORT = process.env.PORT || 8000;
require("dotenv").config();
const mongoose = require("mongoose");
const helmet = require("helmet")
const checkAuth = require("./middleware/check-auth")

// routers
const admin = require("./routes/admin.router")
const login = require("./routes/login.router");
const auth = require("./routes/auth/auth.router");
const limiter = require("./middleware/rateLimiter");
// ...

// ====
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With")
  res.setHeader("Access-Control-Allow-Method", "GET, POST, PATCH, DELETE")
  next()
})

//middleware
app.use(helmet())
app.use(express.json());
// ===
app.use(express.static(path.join(__dirname, "frontend", "build")))

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.use("/", login)
app.use("/forgot-password", auth)
app.use("/reset-password", auth)
app.use(checkAuth)
app.use("/admin", admin)

app.use((req, res, next) => {
  const error = { message: "No page found", code: 404 }
  return res.status(error.code).json(error)
})
app.use((error, req, res, next) => {
  if (req.headerSent) {
    return next(error)
  }
  return res.status(error.code || 500).json({ message: error.message || "Unknown error occured" })
})
// ...
// ===

module.exports = app;
