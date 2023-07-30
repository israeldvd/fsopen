const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  const n = persons ? persons.length : 0;
  const isThereJustAPerson = n === 1;
  const personOrPeople = isThereJustAPerson ? "person" : "people";
  response.send(
    `<p>Phonebook has info for ${n} ${personOrPeople}</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", ({ params }, response) => {
  const id = params.id;
  const person = persons.find((p) => {
    return p.id === Number(id);
  });

  if (!person) return response.status(404).end();

  response.json(person);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", ({ body }, response) => {
  if (!body || !body.name || body.name.trim() === "") {
    return response.status(400).json({
      error: "Name is missing.",
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
