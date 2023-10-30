const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");

const app = express();

const mongoUrl = config.MONGODB_URI || "mongodb://localhost/bloglist";
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

module.exports = app;
