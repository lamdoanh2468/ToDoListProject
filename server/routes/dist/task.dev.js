"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/taskController"),
    getAllTasks = _require.getAllTasks;

router.get("/", getAllTasks);
module.exports = router;