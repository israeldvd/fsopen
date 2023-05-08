import { areAllNumbers } from "../utils/number.util";

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

type ExercisesValues = number[];

function parseExercisesInput(args: string[]): ExercisesValues {
  // offset of 2: arguments for command and file path
  // then the minimum of 2: target and at least one day (up until +7 args = 10)
  const targetPos = 2;

  if (args.length <= targetPos + 1) throw new Error("Too few arguments!");

  const receivedDailyValuesArgsInput = args.slice(targetPos, undefined);

  if (!areAllNumbers(...receivedDailyValuesArgsInput)) {
    throw new Error("Input values are not all numbers.");
  }

  const dailyMetricsValues: ExercisesValues = receivedDailyValuesArgsInput.map(
    (val) => {
      return Number(val);
    }
  );

  return dailyMetricsValues;
}

function countTrainingDays(dailyHours: number[]): number {
  return dailyHours.reduce((prev, curr) => {
    if (curr > 0) return (prev += 1);
    else return prev;
  }, 0);
}

function sumDailyHours(dailyHours: number[]): number {
  return dailyHours.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
}

function getAverageTime(sum: number, period: number): number {
  return sum / period || 0;
}

function calculateFinalRating(averageTime: number, targetTime: number): number {
  if (averageTime >= targetTime) return 3;
  else if (averageTime > targetTime * 0.8) return 2;
  else return 1;
}

export function exerciseCalculator(array: number[], target: number): Result {
  const periodLength = array.length;
  const trainingDays = countTrainingDays(array);
  const sum = sumDailyHours(array);
  const averageTime = getAverageTime(sum, periodLength);

  const ratingOptions: Record<number, string> = {
    1: "your daily hours are bad",
    2: "not too bad but could be better",
    3: "your daily hours are good",
  };

  const finalRating = calculateFinalRating(averageTime, target);

  return {
    periodLength: periodLength,
    trainingDays: trainingDays,
    success: averageTime > target,
    rating: finalRating,
    ratingDescription: ratingOptions[finalRating],
    target: target,
    average: averageTime,
  };
}

try {
  const [target, ...dailyValues] = parseExercisesInput(process.argv);
  console.log(exerciseCalculator(dailyValues, target));
} catch (error: unknown) {
  let errorMessage = "Something went wrong.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
