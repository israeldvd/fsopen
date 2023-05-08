interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

function countTrainingDays(dailyHours: number[]): number {
  return dailyHours.reduce((prev, curr) => {
    console.log(prev, curr);
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

console.log(exerciseCalculator([3, 0, 2, 4.5, 0, 3, 1], 2));
