export type BmiResponse =
  | { weight: number; height: number; bmi: string }
  | { error: string };

export { Result as ExercisesResultType } from "../e9.3/exerciseCalculator";
