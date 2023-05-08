import express from "express";
import calculateBmi from "./e9.3/bmiCalculator";
import { BmiResponse } from "./types/responses.type";
import { areAllNumbers } from "./utils/number.util";
const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const queryHeight = req.query?.height;
  const queryWeight = req.query?.weight;
  let height: number;
  let weight: number;
  const hasMalformedParameters = !areAllNumbers(queryHeight, queryWeight);
  let healthCondition: string;
  let response: BmiResponse;

  try {
    if (hasMalformedParameters) throw new Error("Input values must be numbers");
    else {
      height = Number(queryHeight);
      weight = Number(queryWeight);
    }

    healthCondition = calculateBmi(height, weight);
    response = { height, weight, bmi: healthCondition };
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";

    if (error instanceof Error) {
      errorMessage += " " + error.message;
    }

    console.error(errorMessage);
    response = { error: "malformed parameters" };
  }

  res.json(response);
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
