const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

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

const url = process.env.MONGODB_URI;

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
    console.log("person saved!");
    mongoose.connection.close();
  });
}
