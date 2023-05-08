import express from "express";
import calculateBmi from "./helpers/bmi-calculator.helper";
import {
  BmiResponse,
  ExercisesResultType,
  WebExercisesResponse,
} from "./types/responses.type";
import { areAllNumbers } from "./utils/number.util";
import exerciseCalculator from "./helpers/exercises-calculator.helper";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const queryHeight = req.query?.height as string;
  const queryWeight = req.query?.weight as string;
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

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises: dailyExercises, target } = req.body;
  const dailyExercisesNumbers: number[] = [];
  let dailyExercisesResultInfo: ExercisesResultType = {
    periodLength: 0,
    average: 0,
    rating: 0,
    success: false,
    target: 0,
    trainingDays: 0,
    ratingDescription: "",
  };
  const response: { body: WebExercisesResponse; status: number | undefined } = {
    body: dailyExercisesResultInfo, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    status: undefined,
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-member-access
  if (!target || !dailyExercises || dailyExercises.length != 7) {
    response.body = { error: "parameters missing" };
    response.status = 400;
  } else if (
    target &&
    dailyExercises &&
    areAllNumbers(target, ...dailyExercises) // eslint-disable-line @typescript-eslint/no-unsafe-argument
  ) {
    for (const val of dailyExercises) {
      dailyExercisesNumbers.push(Number(val));
    }

    dailyExercisesResultInfo = exerciseCalculator(
      dailyExercisesNumbers,
      Number(target)
    );

    response.body = dailyExercisesResultInfo; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    response.status = 200;
  } else {
    response.body = { error: "malformatted parameters" };
    response.status = 400;
  }

  return res.status(response.status).json(response.body);
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
