"use strict";

var express = require("express");

var cors = require("cors");

require("dotenv").config(); //!Middleware


var app = express();
app.use(cors());
app.use(express.json()); //Route configuration

var taskRoutes = require("../server/routes/task");

app.use("/api/tasks", taskRoutes);
var port = process.env.PORT || 3000;
app.get("/", function (req, res) {
  res.send("Hello World");
});
app.listen(port, function () {
  console.log("Starting local host in port ".concat(port, ":"));
});