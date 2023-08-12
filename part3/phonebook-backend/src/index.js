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

const errorHandler = (error, _req, res, next) => {
  console.error(error);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "Malformatted ID" });
  }

  next(error);
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
  Person.find({})
    .then((persons) => {
      const n = persons ? persons.length : 0;
      const isThereJustAPerson = n === 1;
      const personOrPeople = isThereJustAPerson ? "person" : "people";
      response.send(
        `<p>Phonebook has info for ${n} ${personOrPeople}</p><p>${new Date()}</p>`
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", ({ params }, response, next) => {
  const id = params.id;
  Person.findById(id)
    .then((person) => {
      if (!person) return response.status(404).end();

      response.json(person);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", ({ body, params }, response, next) => {
  const number = body.number;

  Person.findByIdAndUpdate(params.id, { number }, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        if (updatedPerson.isNew) {
          console.log("updated", updatedPerson.name);
        }
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      const transformedPersons = persons.map((person) => person.toJSON());
      response.json(transformedPersons);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", ({ body }, response, next) => {
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

  Person.exists({ name: name })
    .then((personFound) => {
      nameIsAlreadyPresent = !!personFound;

      return nameIsAlreadyPresent;
    })
    .then((nameIsAlreadyPresent) => {
      if (nameIsAlreadyPresent === true) {
        errorMessage = "name must be unique";
      }

      const someErrorWasFound = errorMessage !== "";
      if (someErrorWasFound) {
        return response.status(400).json({
          error: errorMessage,
        });
      }

      const newPerson = {
        name: body.name,
        number: body.number,
      };

      return Person.create(newPerson)
        .then((personDoc) => {
          response.json(personDoc.toJSON());
        })
        .catch((error) => {
          console.log(error.message);
          response.status(500).send({ error: error.message });
        });
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", ({ params }, response, next) => {
  Person.findByIdAndDelete(params.id)
    .then((result) => {
      if (result) console.log("Deleted:", result.toJSON());
      response.json(204).end();
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
