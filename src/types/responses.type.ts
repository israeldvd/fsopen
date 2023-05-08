export type BmiResponse =
  | { weight: number; height: number; bmi: string }
  | { error: string };
