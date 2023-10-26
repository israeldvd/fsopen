// configure dotenv-related packages when outside the production environment
if (process.env.NODE_ENV !== "production") {
  require("dotenv-expand").expand(require("dotenv").config());
}

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGO_URI
    : process.env.MONGODB_URI;

const PORT = process.env.PORT;

module.exports = {
  MONGODB_URI,
  PORT,
};
