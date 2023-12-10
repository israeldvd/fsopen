const mongoose = require("mongoose");
const { MissingParamError } = require("../utils/errors/params");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: new MissingParamError("username").message,
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

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
