const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("../controllers/blogs");
const config = require("../utils/config");

const app = express();

const mongoUrl = config.MONGODB_URI || "mongodb://localhost/bloglist";
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

const appPort = config.PORT;
app.listen(appPort, () => {
  console.log(`Server running on port ${appPort}`);
});
