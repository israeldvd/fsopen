const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
const numberValidationRegex = /^\d{2,3}-\d+$/;

mongoose.set("strictQuery", false);

console.log("connecting to", url);
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    min: 8,
    validate: {
      validator: (val) =>
        numberValidationRegex.test(typeof val === "string" ? val.trim() : val),
      message: (props) =>
        `${props.value} is not a valid phone number! Numbers must be of the form 12-1234567 or 123-22334455 (one hyphen following 2 or 3 numbers, and only numbers thereafter).`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (_doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
