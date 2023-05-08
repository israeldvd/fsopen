export const isNotNumber = (arg: any) => {
    return isNaN(Number(arg));
};

export const checkIfNumbers = (...args: any[]) => {
    return args.length>0 && !args.reduce((prevValue, currValue) => {
        return isNotNumber(currValue) || prevValue;
    }, false);
};
