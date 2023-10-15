const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("../controllers/blogs");

// configure dotenv-related packages when outside the production environment
if (process.env.NODE_ENV !== "production") {
  require("dotenv-expand").expand(require("dotenv").config());
}

const mongoUrl = process.env.MONGODB_URI || "mongodb://localhost/bloglist";
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
