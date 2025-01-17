const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

// configure dotenv-related packages when not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv-expand").expand(require("dotenv").config());
}

// Mongoose model Person
const Person = require("./models/person");

// morgan logger setup
morgan.token("data", function getData(req) {
  if (req.method === "POST") return JSON.stringify(req.body);
  if (req.method === "PUT") return JSON.stringify({ id: req.params.id });
});

// unknown-endpoint middleware
const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// error-handler middleware (when cathing exceptions)
const errorHandler = (error, _req, res, next) => {
  console.error(error);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "Malformatted ID" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};

// appliation middleware setups
app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
app.use(express.static("build"));

// endpoints (resources and actions)
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response, next) => {
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

  Person.findByIdAndUpdate(
    params.id,
    { number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      return updatedPerson
        ? response.json(updatedPerson)
        : response.status(404).end();
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
  let nameIsAlreadyPresent = false;

  if (!body) {
    errorMessage = "Content is missing.";
  } else {
    const nameIsMissing = !name || name.trim() === "";
    const numberIsMissing = !body.number;

    if (nameIsMissing) {
      errorMessage = "Name is missing.";
    } else if (numberIsMissing) {
      errorMessage = "Number is missing";
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
        .catch((error) => next(error));
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

// handle remaining endpoints' requests
app.use(unknownEndpoint);

// catch and handle errors
app.use(errorHandler);

// initiate app
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
