const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: String, required: false },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString();

    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
