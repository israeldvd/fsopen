import { checkIfNumbers as areAllNumbers } from "../utils/number.util";

export interface PersonInfoValues {
  weight: number;
  height: number;
}

export function parseBMIInput(args: string[]): PersonInfoValues {
  if (args.length < 4) throw new Error("Too few arguments!");
  if (args.length > 4) throw new Error("Too many arguments!");

  const heightArgInput = args[2];
  const weightArgInput = args[3];

  if (!areAllNumbers(heightArgInput, weightArgInput)) {
    throw new Error("Input values are not numbers.");
  }

  return {
    height: Number(heightArgInput),
    weight: Number(weightArgInput),
  };
}

export default function calculateBmi(height: number, weight: number) {
  const bmi = weight / (height / 100) ** 2;

  if (bmi < 18.5) return "Underweight";
  else if (bmi < 25) return "Healthy weight";
  else if (bmi < 30) return "Overweight";
  else return "Obesity";
}

try {
  const { height, weight } = parseBMIInput(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = "Something went wrong.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
