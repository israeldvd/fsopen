export const isNotNumber = (arg: number | string) => {
  return isNaN(Number(arg));
};

export const areAllNumbers = (...args: (string | number)[]) => {
  return (
    args.length > 0 &&
    !args.reduce((prevValue, currValue) => {
      return isNotNumber(currValue) || prevValue;
    }, false)
  );
};
