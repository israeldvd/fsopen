export const isNotNumber = (arg: any) => {
    return isNaN(Number(arg));
};

export const areNumbers = (args: any[]) => {
    return !args.reduce((prevValue, currValue) => {
        return isNotNumber(currValue) || prevValue;
    }, false);
};
