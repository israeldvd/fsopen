require("dotenv-expand").expand(require("dotenv").config());
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

morgan.token("data", function getData(req) {
  if (req.method === "POST") return JSON.stringify(req.body);
});

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
app.use(express.static("build"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    const n = persons ? persons.length : 0;
    const isThereJustAPerson = n === 1;
    const personOrPeople = isThereJustAPerson ? "person" : "people";
    response.send(
      `<p>Phonebook has info for ${n} ${personOrPeople}</p><p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons/:id", ({ params }, response) => {
  const id = params.id;
  Person.findById(id).then((person) => {
    if (!person) return response.status(404).end();

    response.json(person);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((persons) => {
      const transformedPersons = persons.map((person) => person.toJSON());
      response.json(transformedPersons);
    })
    .catch((reason) => {
      console.error("Could not connect:", reason);
      response.json({ error: reason.message });
    });
});

app.post("/api/persons", ({ body }, response) => {
  const name = body?.name;
  let errorMessage = "";
  let dataIsMissing = false;
  let nameIsAlreadyPresent = false;

  if (!body) {
    errorMessage = "Content is missing.";
  } else {
    const nameIsMissing = !name || name.trim() === "";
    const numberIsMissing = !body.number;

    if (nameIsMissing) {
      errorMessage = "Name is missing.";
      dataIsMissing = true;
    } else if (numberIsMissing) {
      errorMessage = "Number is missing";
      dataIsMissing = true;
    }
  }

  nameIsAlreadyPresent = persons.some((person) => {
    return person.name === name;
  });
  if (nameIsAlreadyPresent === true) {
    errorMessage = " name must be unique";
  }

  if (dataIsMissing || nameIsAlreadyPresent) {
    return response.status(400).json({
      error: errorMessage,
    });
  }

  const newPerson = {
    id: getRandomInt(60000),
    name: body.name,
    number: body.number || 0,
  };

  persons.push(newPerson);
  response.json(newPerson);
});

app.delete("/api/persons/:id", ({ params }, response) => {
  const id = Number(params.id);

  persons = persons.filter((person) => {
    return person.id !== id;
  });

  response.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
