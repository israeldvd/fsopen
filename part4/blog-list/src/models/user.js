const mongoose = require("mongoose");
const { MissingParamError } = require("../utils/errors/params");
const uniqueValidator = require("mongoose-unique-validator");
const ConflictError = require("../utils/errors/resources");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: new MissingParamError("username").message,
    unique: new ConflictError("user", ["username"]).message,
    uniqueCaseInsensitive: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: new MissingParamError("passwordHash").message,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
