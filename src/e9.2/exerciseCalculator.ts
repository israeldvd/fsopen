interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

function exerciseCalculator(array: number[], target: number): Result {
    const periodLength = array.length;

    const trainingDays = array.reduce((prev, curr) => {
        console.log(prev, curr);
        if (curr > 0)
            return prev += 1;
        else return prev;
    }, 0);

    const sum = array.reduce((prev, curr) => {
        return prev + curr;
    }, 0);

    const averageTime = (sum / periodLength) || 0;

    const ratingOptions: Record<number, string> = {
        1: 'your daily hours are bad',
        2: 'not too bad but could be better',
        3: 'your daily hours are good'
    }

    const finalRating = Math.floor(averageTime / target) * 3;

    return {
        periodLength: periodLength,
        trainingDays: trainingDays,
        success: averageTime > target,
        rating: finalRating,
        ratingDescription: ratingOptions[finalRating],
        target: target,
        average: averageTime
    };
}

console.log(exerciseCalculator([3, 0, 2, 4.5, 0, 3, 1], 2));
