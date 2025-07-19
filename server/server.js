const express = require("express")
const cors = require("cors");
require("dotenv").config(); //!Middleware
const app = express()
app.use(cors());
app.use(express.json())
//Route configuration
const taskRoutes = require("../server/routes/task")
app.use("/api/tasks", taskRoutes);
const port = process.env.PORT || 3000
app.get("/", (req, res) => {
    res.send("Hello World")
})
app.listen(port, () => {
    console.log(`Starting local host in port ${port}:`)
})