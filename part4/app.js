const config = require("./utils/config")
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const blogsRouter = require("./controllers/blogs")
const { errorHandler } = require("./utils/middleware")

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use("/api/blogs", blogsRouter)
app.use(errorHandler)

module.exports = app
