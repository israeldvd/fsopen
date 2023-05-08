import { Result } from "../helpers/exercises-calculator.helper";

export type BmiResponse =
  | { weight: number; height: number; bmi: string }
  | { error: string };

export { Result as ExercisesResultType } from "../helpers/exercises-calculator.helper";

export type WebExercisesResponse = Result | { error: string };
