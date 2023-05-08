export function calculateBmi(height: number, weight: number) {
  let bmi = weight / (height / 100) ** 2;

  if (bmi < 18.5) return "Underweight (Unhealthy)";
  else if (bmi < 23) return "Normal (healthy weight)";
  else if (bmi < 25) return "Overweight I (At risk)";
  else if (bmi < 30) return "Overweight II (Moderately obese)";
  else return "Overweight III (Severely obese)";
}

console.log(calculateBmi(180, 74));
