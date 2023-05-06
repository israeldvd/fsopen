interface PersonInfoValues {
    weight: number;
    height: number;
}

function parseBMIInput(args: string[]): PersonInfoValues {
    if (args.length < 4) throw new Error("Too few arguments!");
    if (args.length > 4) throw new Error("Too many arguments!");

    const weightArgInput: number = Number(args[2]);
    const heightArgInput: number = Number(args[3]);

    if (isNaN(weightArgInput) || isNaN(heightArgInput)) {
        throw new Error("Input values are not numbers.");
    }

    return { weight: weightArgInput, height: heightArgInput };
}

function calculateBmi(height: number, weight: number) {
    let bmi = weight / (height / 100) ** 2;

    if (bmi < 18.5) return "Underweight (Unhealthy)";
    else if (bmi < 23) return "Normal (healthy weight)";
    else if (bmi < 25) return "Overweight I (At risk)";
    else if (bmi < 30) return "Overweight II (Moderately obese)";
    else return "Overweight III (Severely obese)";
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
