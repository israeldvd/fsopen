require("dotenv-expand").expand(require("dotenv").config());
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const [, , password, name, number] = process.argv;
const nameIsMissing = !name || name.trim() === "";
const numberIsMissing = !number || number.trim() === "";

if (!nameIsMissing && numberIsMissing) {
  console.log("enter a correct non-empty number");
  process.exit(1);
}

// the URI to make a database connection -- username, hostname and the database name should be defined in the enviroment (could be in an .env file)
const url =
  process.env.MONGODB_URI ||
  `mongodb+srv://${process.PHONE_DB_USERNAME}:${password}@${process.PHONE_DB_HOSTNAME}/${process.PHONE_DB_DATABASE}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (nameIsMissing) {
  Person.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    if (result.name) {
      // TODO: remove validation after establishing validation
      console.log("person saved:", result.toObject().name + "!");
    }
    mongoose.connection.close();
  });
}
