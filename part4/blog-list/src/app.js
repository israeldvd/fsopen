const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("express-async-errors");
const blogsRouter = require("./controllers/blogs");
const config = require("./utils/helpers/config");
const middleware = require("./utils/helpers/middleware");
const usersRouter = require("./controllers/users");
const loginRoute = require("./controllers/login");

const app = express();

const mongoUrl = config.MONGODB_URI || "mongodb://localhost/bloglist";
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRoute);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
